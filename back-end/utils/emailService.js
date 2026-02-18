const nodemailer = require('nodemailer');
const User = require('../models/User');
const { getNextOccurrence, calculateDaysRemaining } = require('./helpers');
const { convertEventToZoroastrian, calculateNextGregorianDate, getZoroastrianDateInfo } = require('./zoroastrianUtils');

// =============================================
// EMAIL SERVICE FOR ZOCAL REMINDERS
// =============================================

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.initializationPromise = this.initializeTransporter();
  }

  // Get the correct frontend URL based on environment
  getFrontendUrl() {
    // Check for explicit frontend URL first
    if (process.env.FRONTEND_URL) {
      return process.env.FRONTEND_URL;
    }
    
    // Check for Vercel deployment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // Check for production environment or default to your Vercel app
    if (process.env.NODE_ENV === 'production') {
      return 'https://zocal.vercel.app';
    }
    
    // Default to localhost for development
    return 'http://localhost:3000';
  }

  // Initialize email transporter
  async initializeTransporter() {
    try {
      // Check if required environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Email configuration missing: EMAIL_USER or EMAIL_PASS not set');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Verify transporter configuration
      await this.transporter.verify();
      this.isInitialized = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.isInitialized = false;
    }
  }

  // Ensure transporter is initialized before use
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializationPromise;
    }
    return this.isInitialized;
  }

  // Generate calendar invite (ICS format)
  generateCalendarInvite(event, eventDate, description) {
    const now = new Date();
    const eventStartDateTime = new Date(eventDate);
    eventStartDateTime.setHours(9, 0, 0, 0); // Set to 9 AM
    
    const eventEndDateTime = new Date(eventStartDateTime);
    eventEndDateTime.setHours(10, 0, 0, 0); // Set to 10 AM (1 hour duration)
    
    // Format dates for ICS
    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ZoCal//ZoCal Event Reminder//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event._id}@zocal.app`,
      `DTSTART:${formatICSDate(eventStartDateTime)}`,
      `DTEND:${formatICSDate(eventEndDateTime)}`,
      `DTSTAMP:${formatICSDate(now)}`,
      `SUMMARY:${event.name} ZoCal`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  }

  // Send reminder email for a Zoroastrian event with calendar invite
  async sendZoroastrianReminderEmail(event, user, daysUntilEvent) {
    try {
      // Ensure email service is initialized
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      // Use Zoroastrian calendar calculations
      const nextOccurrence = calculateNextGregorianDate(event, user.default_zoro_cal);
      const zoroastrianDateInfo = this.getZoroastrianDateInfo(event, user.default_zoro_cal);
      
      const emailContent = this.generateZoroastrianReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroastrianDateInfo);
      
      // Generate calendar invite description
      const calendarDescription = `Event Name: ${event.name}\nCategory: ${event.category}\nOriginal Gregorian Date: ${event.eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nCalendar Type: ${user.default_zoro_cal}\nZoroastrian Date: ${zoroastrianDateInfo.isGatha ? `Gatha: ${zoroastrianDateInfo.gatha}` : `Roj: ${zoroastrianDateInfo.roj}, Mah: ${zoroastrianDateInfo.mah}`}\nFalls On: ${nextOccurrence.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\nThis reminder was sent from ZoCal - Your Zoroastrian Calendar App`;
      
      const calendarInvite = this.generateCalendarInvite(event, nextOccurrence, calendarDescription);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `ZoCal Zoroastrian Reminder: ${event.name} is in ${daysUntilEvent} ${daysUntilEvent === 1 ? 'day' : 'days'}`,
        html: emailContent,
        icalEvent: {
          content: calendarInvite,
          method: 'PUBLISH'
        },
        attachments: [{
          filename: `${event.name}_ZoCal.ics`,
          content: calendarInvite,
          contentType: 'text/calendar; charset=utf-8',
          contentDisposition: 'attachment'
        }]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Zoroastrian reminder email with calendar invite sent for event ${event.name} to ${user.email}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send Zoroastrian reminder email for event ${event.name}:`, error.message);
      throw error;
    }
  }

  // Send reminder email for a Gregorian event with calendar invite
  async sendGregorianReminderEmail(event, user, daysUntilEvent) {
    try {
      // Ensure email service is initialized
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      // Calculate next Gregorian occurrence 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const eventDate = new Date(event.eventDate);
      const currentYear = today.getFullYear();
      
      // Create this year's occurrence
      const thisYearEvent = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
      thisYearEvent.setHours(0, 0, 0, 0);
      
      let nextGregorianOccurrence;
      if (thisYearEvent >= today) {
        nextGregorianOccurrence = thisYearEvent;
      } else {
        // Next year's occurrence
        nextGregorianOccurrence = new Date(currentYear + 1, eventDate.getMonth(), eventDate.getDate());
        nextGregorianOccurrence.setHours(0, 0, 0, 0);
      }
      
      const emailContent = this.generateGregorianReminderEmailContent(event, user, daysUntilEvent, nextGregorianOccurrence);
      
      // Generate calendar invite description
      const calendarDescription = `Event Name: ${event.name}\nCategory: ${event.category}\nOriginal Gregorian Date: ${event.eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nFalls On: ${nextGregorianOccurrence.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\nThis reminder was sent from ZoCal - Your Zoroastrian Calendar App`;
      
      const calendarInvite = this.generateCalendarInvite(event, nextGregorianOccurrence, calendarDescription);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `ZoCal Gregorian Reminder: ${event.name} is in ${daysUntilEvent} ${daysUntilEvent === 1 ? 'day' : 'days'}`,
        html: emailContent,
        icalEvent: {
          content: calendarInvite,
          method: 'PUBLISH'
        },
        attachments: [{
          filename: `${event.name}_ZoCal.ics`,
          content: calendarInvite,
          contentType: 'text/calendar; charset=utf-8',
          contentDisposition: 'attachment'
        }]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Gregorian reminder email with calendar invite sent for event ${event.name} to ${user.email}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send Gregorian reminder email for event ${event.name}:`, error.message);
      throw error;
    }
  }

  // Keep original method for backward compatibility
  async sendReminderEmail(event, user, daysUntilEvent) {
    return await this.sendZoroastrianReminderEmail(event, user, daysUntilEvent);
  }

  // Get Zoroastrian date information based on calendar type
  getZoroastrianDateInfo(event, calendarType) {
    // Convert event to Zoroastrian calendar using proper calculations
    const zoroEvent = convertEventToZoroastrian(event, calendarType);
    
    if (zoroEvent.isGatha) {
      return {
        isGatha: true,
        gatha: zoroEvent.roj,
        roj: null,
        mah: null
      };
    } else {
      return {
        isGatha: false,
        gatha: null,
        roj: zoroEvent.roj,
        mah: zoroEvent.mah
      };
    }
  }

  // Generate HTML email content for Zoroastrian reminder
  generateZoroastrianReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroDateInfo) {
    const gregorianDate = event.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Handle the Falls On date - use nextOccurrence if available, otherwise fallback
    let fallsOnDate = 'Calculating...';
    if (nextOccurrence) {
      fallsOnDate = nextOccurrence.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const zoroastrianInfo = zoroDateInfo.isGatha 
      ? `Gatha: ${zoroDateInfo.gatha}`
      : `Roj: ${zoroDateInfo.roj}<br>Mah: ${zoroDateInfo.mah}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; font-size: 16px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f8f9fa; padding: 35px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; font-size: 18px; }
          .event-details { background: white; padding: 25px; border-radius: 10px; margin: 25px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          
          .details-table { width: 100%; border-collapse: collapse; }
          .details-table td { padding: 12px; border-bottom: 2px solid #f0f0f0; vertical-align: top; }
          .details-table tr:last-child td { border-bottom: none; }
          .detail-label { font-weight: bold; color: #555; width: 40%; font-size: 16px; }
          .detail-value { color: #333; width: 60%; font-size: 18px; font-weight: 500; }
          
          .countdown { background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0; border-left: 5px solid #28a745; }
          .countdown h2 { margin: 0; color: #28a745; font-size: 24px; }
          .footer { text-align: center; margin-top: 35px; color: #666; font-size: 15px; line-height: 1.5; }
          .intro-text { font-size: 18px; margin: 20px 0; }
          .closing-text { font-size: 17px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🗓️ ZoCal Zoroastrian Event Reminder</h1>
        </div>
        
        <div class="content">
          <p class="intro-text">Hello,</p>
          
          <p class="intro-text">This is a friendly reminder about your upcoming Zoroastrian event:</p>
          
          <div class="event-details">
            <table class="details-table">
              <tr>
                <td class="detail-label">Event Name:</td>
                <td class="detail-value">${event.name}</td>
              </tr>
              <tr>
                <td class="detail-label">Category:</td>
                <td class="detail-value">${event.category}</td>
              </tr>
              <tr>
                <td class="detail-label">Original Gregorian Date:</td>
                <td class="detail-value">${gregorianDate}</td>
              </tr>
              <tr>
                <td class="detail-label">Calendar Type:</td>
                <td class="detail-value">${user.default_zoro_cal}</td>
              </tr>
              <tr>
                <td class="detail-label">Zoroastrian Date:</td>
                <td class="detail-value">${zoroastrianInfo}</td>
              </tr>
              <tr>
                <td class="detail-label">Falls On:</td>
                <td class="detail-value">${fallsOnDate}</td>
              </tr>
            </table>
          </div>
          
          <div class="countdown">
            <h2>Event is in ${daysUntilEvent} ${daysUntilEvent === 1 ? 'day' : 'days'}! 📅</h2>
          </div>
          
          <p class="closing-text">Make sure to mark your calendar and prepare for this special occasion. A calendar invite has been included with this email.</p>
          
          <div class="footer">
            <p><strong>This reminder was sent from ZoCal - Your Zoroastrian Calendar App</strong></p>
            <p style="font-size: 13px; color: #999; margin-top: 10px;">To update your notification preferences, please log into your ZoCal account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML email content for Gregorian reminder
  generateGregorianReminderEmailContent(event, user, daysUntilEvent, nextGregorianOccurrence) {
    const gregorianDate = event.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fallsOnDate = nextGregorianOccurrence.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; font-size: 16px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f8f9fa; padding: 35px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; font-size: 18px; }
          .event-details { background: white; padding: 25px; border-radius: 10px; margin: 25px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          
          .details-table { width: 100%; border-collapse: collapse; }
          .details-table td { padding: 12px; border-bottom: 2px solid #f0f0f0; vertical-align: top; }
          .details-table tr:last-child td { border-bottom: none; }
          .detail-label { font-weight: bold; color: #555; width: 40%; font-size: 16px; }
          .detail-value { color: #333; width: 60%; font-size: 18px; font-weight: 500; }
          
          .countdown { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0; border-left: 5px solid #3b82f6; }
          .countdown h2 { margin: 0; color: #1e40af; font-size: 24px; }
          .footer { text-align: center; margin-top: 35px; color: #666; font-size: 15px; line-height: 1.5; }
          .intro-text { font-size: 18px; margin: 20px 0; }
          .closing-text { font-size: 17px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 ZoCal Gregorian Event Reminder</h1>
        </div>
        
        <div class="content">
          <p class="intro-text">Hello,</p>
          
          <p class="intro-text">This is a friendly reminder about your upcoming Gregorian event:</p>
          
          <div class="event-details">
            <table class="details-table">
              <tr>
                <td class="detail-label">Event Name:</td>
                <td class="detail-value">${event.name}</td>
              </tr>
              <tr>
                <td class="detail-label">Category:</td>
                <td class="detail-value">${event.category}</td>
              </tr>
              <tr>
                <td class="detail-label">Original Gregorian Date:</td>
                <td class="detail-value">${gregorianDate}</td>
              </tr>
              <tr>
                <td class="detail-label">Falls On:</td>
                <td class="detail-value">${fallsOnDate}</td>
              </tr>
            </table>
          </div>
          
          <div class="countdown">
            <h2>Event is in ${daysUntilEvent} ${daysUntilEvent === 1 ? 'day' : 'days'}! 📅</h2>
          </div>
          
          <p class="closing-text">Make sure to mark your calendar and prepare for this special occasion. A calendar invite has been included with this email.</p>
          
          <div class="footer">
            <p><strong>This reminder was sent from ZoCal - Your Zoroastrian Calendar App</strong></p>
            <p style="font-size: 13px; color: #999; margin-top: 10px;">To update your notification preferences, please log into your ZoCal account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Keep original method for backward compatibility
  generateReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroDateInfo) {
    return this.generateZoroastrianReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroDateInfo);
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      // Ensure email service is initialized
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      const testMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: 'ZoCal Email Configuration Test',
        html: `
          <h2>Email Configuration Test Successful! ✅</h2>
          <p>Your ZoCal email service is properly configured and ready to send reminders.</p>
          <p>Test sent at: ${new Date().toLocaleString()}</p>
        `
      };

      const result = await this.transporter.sendMail(testMailOptions);
      console.log('✅ Test email sent successfully');
      return result;

    } catch (error) {
      console.error('❌ Email configuration test failed:', error.message);
      throw error;
    }
  }

  // Send email verification email
  async sendVerificationEmail(user, token) {
    try {
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      const verificationUrl = `${this.getFrontendUrl()}/verify-email?token=${token}`;
      
      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 35px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
            .button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: white !important; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔗 Verify Your ZoCal Account</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>Thank you for registering with ZoCal - Your Zoroastrian Calendar App! To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0;">Verify My Email Address</a>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 5px; font-family: monospace;">${verificationUrl}</p>
            
            <div class="warning">
              <strong>Important:</strong> This verification link will expire in 30 minutes for security reasons. If you don't verify within this time, you'll need to request a new verification email.
            </div>
            
            <p>If you didn't create an account with ZoCal, please ignore this email.</p>
            
            <div class="footer">
              <p><strong>ZoCal - Your Zoroastrian Calendar App</strong></p>
              <p>Helping you stay connected to Zoroastrian traditions and celebrations.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify Your ZoCal Account - Action Required',
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${user.email}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send verification email to ${user.email}:`, error.message);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, token) {
    try {
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      const resetUrl = `${this.getFrontendUrl()}/reset-password?token=${token}`;
      
      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 35px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white !important; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
            .button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: white !important; }
            .warning { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
            .security-note { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 Reset Your ZoCal Password</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset the password for your ZoCal account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white !important; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0;">Reset My Password</a>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 5px; font-family: monospace;">${resetUrl}</p>
            
            <div class="warning">
              <strong>Important:</strong> This password reset link will expire in 30 minutes for security reasons. If you don't reset your password within this time, you'll need to request a new reset link.
            </div>
            
            <div class="security-note">
              <strong>Security Note:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged. Consider reviewing your account security if you receive multiple unexpected reset emails.
            </div>
            
            <div class="footer">
              <p><strong>ZoCal - Your Zoroastrian Calendar App</strong></p>
              <p>Protecting your account and privacy is our priority.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset Your ZoCal Password - Action Required',
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${user.email}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${user.email}:`, error.message);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
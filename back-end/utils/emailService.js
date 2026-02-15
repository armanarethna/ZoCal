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

  // Send reminder email for a Zoroastrian event
  async sendReminderEmail(event, user, daysUntilEvent) {
    try {
      // Ensure email service is initialized
      const initialized = await this.ensureInitialized();
      
      if (!initialized || !this.transporter) {
        throw new Error('Email service not properly initialized');
      }

      // Use Zoroastrian calendar calculations - get next occurrence based on Zoroastrian calendar
      const nextOccurrence = calculateNextGregorianDate(event, user.default_zoro_cal);
      const zoroastrianDateInfo = this.getZoroastrianDateInfo(event, user.default_zoro_cal);
      
      const emailContent = this.generateReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroastrianDateInfo);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `ZoCal Reminder: ${event.name} is in ${daysUntilEvent} ${daysUntilEvent === 1 ? 'day' : 'days'}`,
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Reminder email sent for event ${event.name} to ${user.email}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send reminder email for event ${event.name}:`, error.message);
      throw error;
    }
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

  // Generate HTML email content for reminder
  generateReminderEmailContent(event, user, daysUntilEvent, nextOccurrence, zoroDateInfo) {
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
          <h1>🗓️ ZoCal Event Reminder</h1>
        </div>
        
        <div class="content">
          <p class="intro-text">Dear <strong>${user.name}</strong>,</p>
          
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
          
          <p class="closing-text">Make sure to mark your calendar and prepare for this special occasion.</p>
          
          <div class="footer">
            <p><strong>This reminder was sent from ZoCal - Your Zoroastrian Calendar App</strong></p>
            <p style="font-size: 13px; color: #999; margin-top: 10px;">To update your notification preferences, please log into your ZoCal account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
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
}

// Export singleton instance
module.exports = new EmailService();
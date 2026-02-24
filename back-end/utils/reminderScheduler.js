const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const emailService = require('./emailService');
const { calculateZoroastrianDaysRemaining } = require('./zoroastrianUtils');
const { calculateNextGregorianDate } = require('./zoroastrianUtils');

// =============================================
// ZOROASTRIAN EVENT REMINDER SCHEDULER
// =============================================

class ReminderScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduledJob = null;
    console.log('📅 ReminderScheduler initialized');
  }

  // Start the scheduler - runs every minute
  start() {
    if (this.isRunning) {
      console.log('⚠️ Reminder scheduler is already running');
      return;
    }

    // Schedule to run every minute (* * * * *)
    this.scheduledJob = cron.schedule('* * * * *', async () => {
      console.log('🔄 Running minute-based reminder check...');
      await this.checkAndSendReminders();
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.scheduledJob.start();
    this.isRunning = true;
    console.log('✅ Reminder scheduler started - will run every minute');
  }

  // Stop the scheduler
  stop() {
    if (this.scheduledJob) {
      this.scheduledJob.stop();
      this.isRunning = false;
      console.log('⏹️ Reminder scheduler stopped');
    }
  }

  // Check if current time matches user's preferred reminder time
  isReminderTime(event, user) {
    const now = new Date();
    const userTimezone = user.timezone || 'Asia/Kolkata';
    
    // Get current time in user's timezone
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
    const currentHour = userTime.getHours();
    const currentMinute = userTime.getMinutes();
    
    // Convert reminder time to 24-hour format
    let reminderHour = event.reminder_time_hour;
    if (event.reminder_time_ampm === 'PM' && reminderHour !== 12) {
      reminderHour += 12;
    } else if (event.reminder_time_ampm === 'AM' && reminderHour === 12) {
      reminderHour = 0;
    }
    
    const reminderMinute = event.reminder_time_minute || 0;
    
    return currentHour === reminderHour && currentMinute === reminderMinute;
  }

  // Calculate days remaining for Gregorian calendar
  calculateGregorianDaysRemaining(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.eventDate);
    const currentYear = today.getFullYear();
    
    // Create this year's occurrence
    const thisYearEvent = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
    thisYearEvent.setHours(0, 0, 0, 0);
    
    let nextOccurrence;
    if (thisYearEvent >= today) {
      nextOccurrence = thisYearEvent;
    } else {
      // Next year's occurrence
      nextOccurrence = new Date(currentYear + 1, eventDate.getMonth(), eventDate.getDate());
      nextOccurrence.setHours(0, 0, 0, 0);
    }
    
    const diffTime = nextOccurrence - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Check for events that need reminders and send them
  async checkAndSendReminders() {
    try {
      console.log('🔍 Checking for events that need reminders...');
      
      // Get all events that have reminders enabled (reminder_days >= 0, excluding -1 which is No Reminder)
      const eventsWithReminders = await Event.find({
        reminder_days: { $gte: 0 }
      }).populate('createdBy');

      let remindersSent = 0;
      let remindersSkipped = 0;

      for (const event of eventsWithReminders) {
        try {
          const user = event.createdBy;
          
          // Check if it's the right time to send reminder for this user
          if (!this.isReminderTime(event, user)) {
            remindersSkipped++;
            continue;
          }

          // Calculate days remaining based on reminder_for setting
          if (event.reminder_for === 'Zoroastrian') {
            const daysUntilZoroEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
            // Send reminder if:
            // - It's the exact reminder day, OR
            // - Event is today and reminder_days > 0, OR
            // - Event is today and reminder_days === 0 (On The Day)
            if (daysUntilZoroEvent === event.reminder_days || 
                (daysUntilZoroEvent === 0 && event.reminder_days > 0) ||
                (daysUntilZoroEvent === 0 && event.reminder_days === 0)) {
              await emailService.sendZoroastrianReminderEmail(event, user, daysUntilZoroEvent);
              remindersSent++;
            }
          } else if (event.reminder_for === 'Gregorian') {
            const daysUntilGregorianEvent = this.calculateGregorianDaysRemaining(event);
            // Send reminder if:
            // - It's the exact reminder day, OR
            // - Event is today and reminder_days > 0, OR
            // - Event is today and reminder_days === 0 (On The Day)
            if (daysUntilGregorianEvent === event.reminder_days || 
                (daysUntilGregorianEvent === 0 && event.reminder_days > 0) ||
                (daysUntilGregorianEvent === 0 && event.reminder_days === 0)) {
              await emailService.sendGregorianReminderEmail(event, user, daysUntilGregorianEvent);
              remindersSent++;
            }
          } else if (event.reminder_for === 'Both') {
            const daysUntilZoroEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
            const daysUntilGregorianEvent = this.calculateGregorianDaysRemaining(event);
            
            let sent = false;
            // Send Zoroastrian reminder if:
            // - It's the exact reminder day, OR
            // - Event is today and reminder_days > 0, OR
            // - Event is today and reminder_days === 0 (On The Day)
            if (daysUntilZoroEvent === event.reminder_days || 
                (daysUntilZoroEvent === 0 && event.reminder_days > 0) ||
                (daysUntilZoroEvent === 0 && event.reminder_days === 0)) {
              await emailService.sendZoroastrianReminderEmail(event, user, daysUntilZoroEvent);
              sent = true;
            }
            // Send Gregorian reminder if:
            // - It's the exact reminder day, OR
            // - Event is today and reminder_days > 0, OR
            // - Event is today and reminder_days === 0 (On The Day)
            if (daysUntilGregorianEvent === event.reminder_days || 
                (daysUntilGregorianEvent === 0 && event.reminder_days > 0) ||
                (daysUntilGregorianEvent === 0 && event.reminder_days === 0)) {
              await emailService.sendGregorianReminderEmail(event, user, daysUntilGregorianEvent);
              sent = true;
            }
            if (sent) {
              remindersSent++;
            }
          }
          
        } catch (error) {
          console.error(`❌ Failed to process reminder for event ${event.name}:`, error.message);
        }
      }

      if (remindersSent > 0 || remindersSkipped > 0) {
        console.log(`✅ Reminder check complete: ${remindersSent} sent, ${remindersSkipped} skipped`);
      }
      
    } catch (error) {
      console.error('❌ Error during reminder check:', error.message);
    }
  }

  // Check if reminder time has passed for today
  hasReminderTimePassed(event, user) {
    const now = new Date();
    const userTimezone = user.timezone || 'Asia/Kolkata';
    
    // Get current time in user's timezone
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
    const currentHour = userTime.getHours();
    const currentMinute = userTime.getMinutes();
    
    // Convert reminder time to 24-hour format
    let reminderHour = event.reminder_time_hour;
    if (event.reminder_time_ampm === 'PM' && reminderHour !== 12) {
      reminderHour += 12;
    } else if (event.reminder_time_ampm === 'AM' && reminderHour === 12) {
      reminderHour = 0;
    }
    
    const reminderMinute = event.reminder_time_minute || 0;
    
    // Time has passed if current hour is greater, or same hour but minute is greater
    return currentHour > reminderHour || (currentHour === reminderHour && currentMinute > reminderMinute);
  }

  // Send immediate reminder for newly created events (if within reminder period)
  async sendImmediateReminderIfNeeded(event, user) {
    try {
      // Only send immediate reminder if reminders are enabled (not -1)
      if (event.reminder_days === undefined || event.reminder_days < 0) {
        return false;
      }

      let sentReminder = false;

      if (event.reminder_for === 'Zoroastrian' || event.reminder_for === 'Both') {
        const daysUntilZoroEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
        
        // Send immediate reminder if:
        // - reminder_days is 0 (On The Day) and event is today AND reminder time has passed, OR
        // - reminder_days > 0 and current days to event is less than or equal to reminder_days (and event is in future)
        const shouldSendToday = (daysUntilZoroEvent === 0 && event.reminder_days === 0 && this.hasReminderTimePassed(event, user));
        const shouldSendFutureDays = (event.reminder_days > 0 && daysUntilZoroEvent <= event.reminder_days && daysUntilZoroEvent > 0);
        
        if (shouldSendToday || shouldSendFutureDays) {
          console.log(`📧 Sending immediate Zoroastrian reminder for event "${event.name}" - ${daysUntilZoroEvent} days remaining`);
          await emailService.sendZoroastrianReminderEmail(event, user, daysUntilZoroEvent);
          sentReminder = true;
        }
      }

      if (event.reminder_for === 'Gregorian' || event.reminder_for === 'Both') {
        const daysUntilGregorianEvent = this.calculateGregorianDaysRemaining(event);
        
        // Send immediate reminder if:
        // - reminder_days is 0 (On The Day) and event is today AND reminder time has passed, OR
        // - reminder_days > 0 and current days to event is less than or equal to reminder_days (and event is in future)
        const shouldSendToday = (daysUntilGregorianEvent === 0 && event.reminder_days === 0 && this.hasReminderTimePassed(event, user));
        const shouldSendFutureDays = (event.reminder_days > 0 && daysUntilGregorianEvent <= event.reminder_days && daysUntilGregorianEvent > 0);
        
        if (shouldSendToday || shouldSendFutureDays) {
          console.log(`📧 Sending immediate Gregorian reminder for event "${event.name}" - ${daysUntilGregorianEvent} days remaining`);
          await emailService.sendGregorianReminderEmail(event, user, daysUntilGregorianEvent);
          sentReminder = true;
        }
      }

      if (!sentReminder) {
        console.log(`ℹ️ Event "${event.name}": Not yet time for immediate reminder`);
      }

      return sentReminder;
      
    } catch (error) {
      console.error(`❌ Failed to send immediate reminder for event ${event.name}:`, error.message);
      return false;
    }
  }

  // Manual trigger for testing purposes
  async runManualCheck() {
    console.log('🧪 Running manual reminder check...');
    await this.checkAndSendReminders();
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.scheduledJob ? this.scheduledJob.nextDate() : null
    };
  }

  // Schedule a one-time reminder check (for testing)
  scheduleOneTimeCheck(delayMinutes = 1) {
    console.log(`⏰ Scheduling one-time reminder check in ${delayMinutes} minute(s)...`);
    
    setTimeout(async () => {
      console.log('🧪 Running scheduled one-time check...');
      await this.checkAndSendReminders();
    }, delayMinutes * 60 * 1000);
  }

  // Get all upcoming reminders for debugging
  async getUpcomingReminders() {
    try {
      const eventsWithReminders = await Event.find({
        reminder_days: { $gte: 0 }
      }).populate('createdBy');

      const upcomingReminders = eventsWithReminders.map(event => {
        const user = event.createdBy;
        const daysUntilZoroEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
        const daysUntilGregorianEvent = this.calculateGregorianDaysRemaining(event);
        
        return {
          eventName: event.name,
          eventDate: event.eventDate,
          reminderDays: event.reminder_days,
          reminderFor: event.reminder_for,
          daysUntilZoroEvent: daysUntilZoroEvent,
          daysUntilGregorianEvent: daysUntilGregorianEvent,
          reminderTime: `${event.reminder_time_hour} ${event.reminder_time_ampm}`,
          userEmail: user.email,
          userTimezone: user.timezone,
          calendarType: user.default_zoro_cal
        };
      });

      return upcomingReminders;
      
    } catch (error) {
      console.error('❌ Error getting upcoming reminders:', error.message);
      return [];
    }
  }
}

// Export singleton instance
module.exports = new ReminderScheduler();
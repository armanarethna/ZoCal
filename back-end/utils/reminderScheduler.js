const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const emailService = require('./emailService');
const { calculateZoroastrianDaysRemaining } = require('./zoroastrianUtils');

// =============================================
// ZOROASTRIAN EVENT REMINDER SCHEDULER
// =============================================

class ReminderScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduledJob = null;
    console.log('📅 ReminderScheduler initialized');
  }

  // Start the scheduler - runs daily at 12:00 PM
  start() {
    if (this.isRunning) {
      console.log('⚠️ Reminder scheduler is already running');
      return;
    }

    // Schedule to run every day at 12:00 PM (0 12 * * *)
    this.scheduledJob = cron.schedule('0 12 * * *', async () => {
      console.log('🔄 Running daily reminder check at 12:00 PM...');
      await this.checkAndSendReminders();
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.scheduledJob.start();
    this.isRunning = true;
    console.log('✅ Reminder scheduler started - will run daily at 12:00 PM');
  }

  // Stop the scheduler
  stop() {
    if (this.scheduledJob) {
      this.scheduledJob.stop();
      this.isRunning = false;
      console.log('⏹️ Reminder scheduler stopped');
    }
  }

  // Check for events that need reminders and send them
  async checkAndSendReminders() {
    try {
      console.log('🔍 Checking for events that need reminders...');
      
      // Get all events that have reminder_days > 0 (i.e., reminders enabled)
      const eventsWithReminders = await Event.find({
        reminder_days: { $gt: 0 }
      }).populate('createdBy');

      let remindersSent = 0;
      let remindersSkipped = 0;

      for (const event of eventsWithReminders) {
        try {
          const user = event.createdBy;
          const daysUntilEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
          
          // Check if we should send a reminder today (use Zoroastrian calendar logic)
          if (daysUntilEvent === event.reminder_days) {
            await emailService.sendReminderEmail(event, user, daysUntilEvent);
            remindersSent++;
          } else {
            remindersSkipped++;
            console.log(`⏭️ Event "${event.name}": ${daysUntilEvent} days remaining (reminder set for ${event.reminder_days} days)`);
          }
          
        } catch (error) {
          console.error(`❌ Failed to process reminder for event ${event.name}:`, error.message);
        }
      }

      console.log(`✅ Reminder check complete: ${remindersSent} sent, ${remindersSkipped} skipped`);
      
    } catch (error) {
      console.error('❌ Error during reminder check:', error.message);
    }
  }

  // Send immediate reminder for newly created events (if within reminder period)
  async sendImmediateReminderIfNeeded(event, user) {
    try {
      // Only send immediate reminder if reminder_days > 0
      if (!event.reminder_days || event.reminder_days === 0) {
        return false;
      }

      const daysUntilEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
      
      // If current days to event is less than or equal to reminder_days, send email now
      if (daysUntilEvent <= event.reminder_days && daysUntilEvent >= 0) {
        console.log(`📧 Sending immediate reminder for event "${event.name}" - ${daysUntilEvent} days remaining (Zoroastrian calendar)`);
        await emailService.sendReminderEmail(event, user, daysUntilEvent);
        return true;
      }

      console.log(`ℹ️ Event "${event.name}": ${daysUntilEvent} days until Zoroastrian occurrence (reminder set for ${event.reminder_days} days)`);
      return false;
      
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
        reminder_days: { $gt: 0 }
      }).populate('createdBy');

      const upcomingReminders = eventsWithReminders.map(event => {
        const user = event.createdBy;
        const daysUntilEvent = calculateZoroastrianDaysRemaining(event, user.default_zoro_cal);
        const willSendReminder = daysUntilEvent === event.reminder_days;
        
        return {
          eventName: event.name,
          eventDate: event.eventDate,
          reminderDays: event.reminder_days,
          daysUntilZoroEvent: daysUntilEvent,
          willSendToday: willSendReminder,
          userEmail: user.email,
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
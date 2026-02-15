const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// =============================================
// MIDDLEWARE CONFIGURATION
// =============================================

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =============================================
// DATABASE CONNECTION
// =============================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// =============================================
// INITIALIZE SERVICES
// =============================================

// Initialize email reminder scheduler
const reminderScheduler = require('./utils/reminderScheduler');
reminderScheduler.start();

// =============================================
// ROUTES
// =============================================

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'ZoCal Backend API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Debug route for testing email configuration
app.get('/api/test-email', async (req, res) => {
  try {
    const emailService = require('./utils/emailService');
    await emailService.testEmailConfiguration();
    res.json({ 
      message: 'Test email sent successfully!',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email test failed:', error.message);
    res.status(500).json({ 
      message: 'Email test failed',
      error: error.message,
      status: 'error'
    });
  }
});

// Debug route for manual reminder check
app.get('/api/test-reminders', async (req, res) => {
  try {
    const reminderScheduler = require('./utils/reminderScheduler');
    await reminderScheduler.runManualCheck();
    res.json({ 
      message: 'Manual reminder check completed',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reminder test failed:', error.message);
    res.status(500).json({ 
      message: 'Reminder test failed',
      error: error.message,
      status: 'error'
    });
  }
});

// Debug route for upcoming reminders
app.get('/api/upcoming-reminders', async (req, res) => {
  try {
    const reminderScheduler = require('./utils/reminderScheduler');
    const upcomingReminders = await reminderScheduler.getUpcomingReminders();
    res.json({ 
      reminders: upcomingReminders,
      count: upcomingReminders.length,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get upcoming reminders failed:', error.message);
    res.status(500).json({ 
      message: 'Get upcoming reminders failed',
      error: error.message,
      status: 'error'
    });
  }
});

// TODO: Add more routes as you build your application
// app.use('/api/users', require('./routes/users'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    status: 'error'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    status: 'error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// =============================================
// SERVER STARTUP
// =============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
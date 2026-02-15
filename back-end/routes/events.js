const express = require('express');
const {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleSearchEvents,
  createEvent,
  getAllEvents,
  updateEvent,
  auth
} = require('../controllers/eventController');

const router = express.Router();

// =============================================
// CLEAN EVENT ROUTES - ALL LOGIC IN CONTROLLER
// =============================================

router.post('/', auth, createEvent, handleCreateEvent);
router.get('/', auth, getAllEvents, handleGetAllEvents);
router.get('/search/:term', auth, handleSearchEvents);
router.get('/:id', auth, handleGetEventById);
router.put('/:id', auth, updateEvent, handleUpdateEvent);
router.delete('/:id', auth, handleDeleteEvent);

module.exports = router;
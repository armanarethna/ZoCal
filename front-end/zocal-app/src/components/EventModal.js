import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { createEvent, updateEvent, deleteEvent, clearError as clearEventsError } from '../store/eventsSlice';
import { validateEventDate } from '../utils/eventUtils';

const EventModal = ({ 
  open, 
  onClose, 
  editingEvent, 
  deleteModalOpen, 
  onDeleteModalClose, 
  eventToDelete 
}) => {
  const dispatch = useDispatch();
  const { loading: eventsLoading } = useSelector(state => state.events);

  const [eventFormData, setEventFormData] = useState({
    name: editingEvent?.name || '',
    category: editingEvent?.category || 'Birthday',
    eventDate: editingEvent ? new Date(editingEvent.eventDate) : new Date(),
    beforeSunrise: editingEvent?.beforeSunrise || false,
    reminder_days: editingEvent?.reminder_days || 0
  });
  const [eventFormErrors, setEventFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Update form data when editingEvent changes
  React.useEffect(() => {
    if (editingEvent) {
      setEventFormData({
        name: editingEvent.name,
        category: editingEvent.category,
        eventDate: new Date(editingEvent.eventDate),
        beforeSunrise: editingEvent.beforeSunrise,
        reminder_days: editingEvent.reminder_days || 0
      });
    } else {
      setEventFormData({
        name: '',
        category: 'Birthday',
        eventDate: new Date(),
        beforeSunrise: false,
        reminder_days: 0
      });
    }
    setEventFormErrors({});
  }, [editingEvent, open]);

  // Handle event form input changes
  const handleEventFormChange = (field, value) => {
    setEventFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user makes changes
    if (eventFormErrors[field]) {
      setEventFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate event form
  const validateEventForm = () => {
    const errors = {};
    
    if (!eventFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!eventFormData.eventDate) {
      errors.eventDate = 'Date is required';
    } else {
      const validation = validateEventDate(eventFormData.eventDate);
      if (!validation.isValid) {
        errors.eventDate = validation.error;
      }
    }
    
    return errors;
  };

  // Handle event form submission
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearEventsError());
    
    const errors = validateEventForm();
    if (Object.keys(errors).length > 0) {
      setEventFormErrors(errors);
      return;
    }
    
    setEventFormErrors({});
    
    try {
      const eventData = {
        name: eventFormData.name,
        category: eventFormData.category,
        eventDate: `${eventFormData.eventDate.getFullYear()}-${String(eventFormData.eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventFormData.eventDate.getDate()).padStart(2, '0')}`, // Local date format YYYY-MM-DD
        beforeSunrise: eventFormData.beforeSunrise,
        reminder_days: eventFormData.reminder_days
      };
      
      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent._id, eventData })).unwrap();
        setSnackbar({ open: true, message: 'Event updated successfully!', severity: 'success' });
      } else {
        await dispatch(createEvent(eventData)).unwrap();
        setSnackbar({ open: true, message: 'Event created successfully!', severity: 'success' });
      }
      
      onClose();
    } catch (error) {
      // Error handling is done by Redux
    }
  };

  // Handle delete event
  const confirmDelete = async () => {
    try {
      await dispatch(deleteEvent(eventToDelete._id)).unwrap();
      setSnackbar({ open: true, message: 'Event deleted successfully!', severity: 'success' });
      onDeleteModalClose();
    } catch (error) {
      // Error handling is done by Redux
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Event Modal */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{editingEvent ? 'Edit Gregorian Event' : 'Add Gregorian Event'}</DialogTitle>
        <form onSubmit={handleEventSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={eventFormData.name}
              onChange={(e) => handleEventFormChange('name', e.target.value)}
              error={!!eventFormErrors.name}
              helperText={eventFormErrors.name}
              required
            />
            
            <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={eventFormData.category}
                onChange={(e) => handleEventFormChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="Birthday">Birthday</MenuItem>
                <MenuItem value="Anniversary">Anniversary</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <DatePicker
              label="Gregorian Date"
              value={eventFormData.eventDate}
              onChange={(date) => handleEventFormChange('eventDate', date)}
              format="dd-MMM-yyyy"
              sx={{ mt: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!eventFormErrors.eventDate}
                  helperText={eventFormErrors.eventDate}
                  required
                />
              )}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={eventFormData.beforeSunrise}
                  onChange={(e) => handleEventFormChange('beforeSunrise', e.target.checked)}
                />
              }
              label="Before Sunrise"
              sx={{ mt: 1, display: 'block' }}
            />

            <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
              <InputLabel>Email Reminder</InputLabel>
              <Select
                value={eventFormData.reminder_days}
                onChange={(e) => handleEventFormChange('reminder_days', e.target.value)}
                label="Email Reminder"
              >
                <MenuItem value={0}>No Reminder</MenuItem>
                <MenuItem value={1}>1 Day Before</MenuItem>
                <MenuItem value={3}>3 Days Before</MenuItem>
                <MenuItem value={7}>1 Week Before</MenuItem>
                <MenuItem value={30}>1 Month Before</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}>
            <Button 
              onClick={onClose}
              size="large"
              sx={{ minWidth: 100, py: 1.5, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={eventsLoading}
              size="large"
              sx={{ minWidth: 100, py: 1.5, px: 3 }}
            >
              {eventsLoading ? <CircularProgress size={20} /> : (editingEvent ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteModalClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={eventsLoading}>
            {eventsLoading ? <CircularProgress size={20} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default EventModal;
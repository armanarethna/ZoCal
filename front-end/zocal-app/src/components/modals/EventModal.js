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
  Alert,
  Typography,
  Tooltip,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { createEvent, updateEvent, deleteEvent, clearError as clearEventsError } from '../../store/eventsSlice';
import { validateEventDate } from '../../utils/eventUtils';
import { TOOLTIP_TEXT } from '../../constants';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Tooltip state management - only one tooltip can be open at once
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const [justOpened, setJustOpened] = useState(null);

  // Tooltip handlers for Before Sunrise
  const handleBeforeSunriseTooltipClick = () => {
    if (isMobile) {
      if (openTooltipId === 'beforeSunrise') {
        setOpenTooltipId(null);
      } else {
        setOpenTooltipId('beforeSunrise');
        setJustOpened('beforeSunrise');
        setTimeout(() => setJustOpened(null), 100);
      }
    }
  };

  const handleBeforeSunriseTooltipClose = () => {
    if (isMobile && justOpened === 'beforeSunrise') {
      return;
    }
    setOpenTooltipId(null);
  };

  // Tooltip handlers for Reminder
  const handleReminderTooltipClick = () => {
    if (isMobile) {
      if (openTooltipId === 'reminder') {
        setOpenTooltipId(null);
      } else {
        setOpenTooltipId('reminder');
        setJustOpened('reminder');
        setTimeout(() => setJustOpened(null), 100);
      }
    }
  };

  const handleReminderTooltipClose = () => {
    if (isMobile && justOpened === 'reminder') {
      return;
    }
    setOpenTooltipId(null);
  };

  // Tooltip handlers for Time Selection
  const handleTimeSelectionTooltipClick = () => {
    if (isMobile) {
      if (openTooltipId === 'timeSelection') {
        setOpenTooltipId(null);
      } else {
        setOpenTooltipId('timeSelection');
        setJustOpened('timeSelection');
        setTimeout(() => setJustOpened(null), 100);
      }
    }
  };

  const handleTimeSelectionTooltipClose = () => {
    if (isMobile && justOpened === 'timeSelection') {
      return;
    }
    setOpenTooltipId(null);
  };

  const [eventFormData, setEventFormData] = useState({
    name: editingEvent?.name || '',
    category: editingEvent?.category || 'Birthday',
    customCategory: '',
    eventDate: editingEvent ? new Date(editingEvent.eventDate) : new Date(),
    beforeSunrise: editingEvent?.beforeSunrise || false,
    reminder_days: editingEvent?.reminder_days !== undefined ? editingEvent.reminder_days : -1,
    reminder_time_hour: editingEvent?.reminder_time_hour || 12,
    reminder_time_minute: editingEvent?.reminder_time_minute !== undefined ? editingEvent.reminder_time_minute : 0,
    reminder_time_ampm: editingEvent?.reminder_time_ampm || 'PM',
    reminder_for: editingEvent?.reminder_for || 'Zoroastrian',
    send_instant_invite: editingEvent?.send_instant_invite || false,
    instant_invite_for: editingEvent?.instant_invite_for || 'Zoroastrian'
  });
  const [eventFormErrors, setEventFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Update form data when editingEvent changes
  React.useEffect(() => {
    if (editingEvent) {
      const isCustomCategory = !['Birthday', 'Anniversary'].includes(editingEvent.category);
      setEventFormData({
        name: editingEvent.name,
        category: isCustomCategory ? 'Other' : editingEvent.category,
        customCategory: isCustomCategory ? editingEvent.category : '',
        eventDate: new Date(editingEvent.eventDate),
        beforeSunrise: editingEvent.beforeSunrise,
        reminder_days: editingEvent.reminder_days !== undefined ? editingEvent.reminder_days : -1,
        reminder_time_hour: editingEvent.reminder_time_hour || 12,
        reminder_time_minute: editingEvent.reminder_time_minute !== undefined ? editingEvent.reminder_time_minute : 0,
        reminder_time_ampm: editingEvent.reminder_time_ampm || 'PM',
        reminder_for: editingEvent.reminder_for || 'Zoroastrian',
        send_instant_invite: editingEvent.send_instant_invite || false,
        instant_invite_for: editingEvent.instant_invite_for || 'Zoroastrian'
      });
    } else {
      setEventFormData({
        name: '',
        category: 'Birthday',
        customCategory: '',
        eventDate: new Date(),
        beforeSunrise: false,
        reminder_days: -1,
        reminder_time_hour: 12,
        reminder_time_minute: 0,
        reminder_time_ampm: 'PM',
        reminder_for: 'Zoroastrian',
        send_instant_invite: false,
        instant_invite_for: 'Zoroastrian'
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
    
    if (eventFormData.category === 'Other' && !eventFormData.customCategory.trim()) {
      errors.customCategory = 'Custom category is required when Other is selected';
    }
    
    if (eventFormData.category === 'Other' && eventFormData.customCategory.trim().length < 5) {
      errors.customCategory = 'Custom category must be at least 5 characters';
    }
    
    if (eventFormData.category === 'Other' && eventFormData.customCategory.trim().length > 50) {
      errors.customCategory = 'Custom category cannot exceed 50 characters';
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
        customCategory: eventFormData.customCategory,
        eventDate: `${eventFormData.eventDate.getFullYear()}-${String(eventFormData.eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventFormData.eventDate.getDate()).padStart(2, '0')}`, // Local date format YYYY-MM-DD
        beforeSunrise: eventFormData.beforeSunrise,
        reminder_days: eventFormData.reminder_days,
        reminder_time_hour: eventFormData.reminder_time_hour,
        reminder_time_minute: eventFormData.reminder_time_minute,
        reminder_time_ampm: eventFormData.reminder_time_ampm,
        reminder_for: eventFormData.reminder_for,
        send_instant_invite: eventFormData.send_instant_invite,
        instant_invite_for: eventFormData.instant_invite_for
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
        <DialogTitle sx={{ pb: 1 }}>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <form onSubmit={handleEventSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a Gregorian date event and the ZoCal app will auto calculate Zoroastrian event details.
            </Typography>
            
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
            
            {/* Custom Category Input - show only when "Other" is selected */}
            {eventFormData.category === 'Other' && (
              <TextField
                fullWidth
                label="Custom Category"
                value={eventFormData.customCategory}
                onChange={(e) => handleEventFormChange('customCategory', e.target.value)}
                error={!!eventFormErrors.customCategory}
                helperText={eventFormErrors.customCategory}
                required
                sx={{ mt: 2 }}
                inputProps={{
                  minLength: 5,
                  maxLength: 50
                }}
                placeholder="Enter custom category (5-50 characters)"
              />
            )}
            
            <DatePicker
              label="Gregorian Date"
              value={eventFormData.eventDate}
              onChange={(date) => handleEventFormChange('eventDate', date)}
              format="dd-MMM-yyyy"
              sx={{ mt: 2, width: '100%' }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!eventFormErrors.eventDate,
                  helperText: eventFormErrors.eventDate,
                  required: true
                }
              }}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventFormData.beforeSunrise}
                    onChange={(e) => handleEventFormChange('beforeSunrise', e.target.checked)}
                  />
                }
                label="Before Sunrise"
              />
              <Tooltip 
                title={TOOLTIP_TEXT.BEFORE_SUNRISE}
                arrow
                placement="top"
                open={isMobile ? openTooltipId === 'beforeSunrise' : undefined}
                onClose={handleBeforeSunriseTooltipClose}
                disableHoverListener={isMobile}
                disableFocusListener={isMobile}
                disableTouchListener={isMobile}
              >
                <IconButton 
                  size="small" 
                  sx={{ color: 'text.secondary', p: 0.5 }}
                  onClick={handleBeforeSunriseTooltipClick}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Email Reminder Section */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Email Reminder</InputLabel>
                  <Select
                    value={eventFormData.reminder_days}
                    onChange={(e) => handleEventFormChange('reminder_days', e.target.value)}
                    label="Email Reminder"
                  >
                    <MenuItem value={-1}>No Reminder</MenuItem>
                    <MenuItem value={0}>On The Day</MenuItem>
                    <MenuItem value={1}>1 Day Before</MenuItem>
                    <MenuItem value={3}>3 Days Before</MenuItem>
                    <MenuItem value={7}>1 Week Before</MenuItem>
                    <MenuItem value={30}>1 Month Before</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip 
                  title={TOOLTIP_TEXT.REMINDER_INFO}
                  arrow
                  placement="top"
                  open={isMobile ? openTooltipId === 'reminder' : undefined}
                  onClose={handleReminderTooltipClose}
                  disableHoverListener={isMobile}
                  disableFocusListener={isMobile}
                  disableTouchListener={isMobile}
                >
                  <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary' }}
                    onClick={handleReminderTooltipClick}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Show additional reminder settings if reminder is enabled */}
              {eventFormData.reminder_days !== -1 && (
                <>
                  {/* Reminder Time Selector */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 80, flex: 1 }}>
                      <InputLabel>Hour</InputLabel>
                      <Select
                        value={eventFormData.reminder_time_hour}
                        onChange={(e) => handleEventFormChange('reminder_time_hour', e.target.value)}
                        label="Hour"
                      >
                        {[...Array(12)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 80, flex: 1 }}>
                      <InputLabel>Minute</InputLabel>
                      <Select
                        value={eventFormData.reminder_time_minute}
                        onChange={(e) => handleEventFormChange('reminder_time_minute', e.target.value)}
                        label="Minute"
                      >
                        {[...Array(60)].map((_, i) => (
                          <MenuItem key={i} value={i}>
                            {String(i).padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 80 }}>
                      <InputLabel>Period</InputLabel>
                      <Select
                        value={eventFormData.reminder_time_ampm}
                        onChange={(e) => handleEventFormChange('reminder_time_ampm', e.target.value)}
                        label="Period"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Tooltip 
                      title="Timezone for reminders can be updated in settings."
                      arrow
                      placement="top"
                      open={isMobile ? openTooltipId === 'timeSelection' : undefined}
                      onClose={handleTimeSelectionTooltipClose}
                      disableHoverListener={isMobile}
                      disableFocusListener={isMobile}
                      disableTouchListener={isMobile}
                    >
                      <IconButton 
                        size="small" 
                        sx={{ color: 'text.secondary' }}
                        onClick={handleTimeSelectionTooltipClick}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>

                  {/* Reminder For Selector */}
                  <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                    <InputLabel>Reminder For</InputLabel>
                    <Select
                      value={eventFormData.reminder_for}
                      onChange={(e) => handleEventFormChange('reminder_for', e.target.value)}
                      label="Reminder For"
                    >
                      <MenuItem value="Zoroastrian">Zoroastrian</MenuItem>
                      <MenuItem value="Gregorian">Gregorian</MenuItem>
                      <MenuItem value="Both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>

            {/* Instant Calendar Invite Section */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventFormData.send_instant_invite}
                    onChange={(e) => handleEventFormChange('send_instant_invite', e.target.checked)}
                  />
                }
                label="Send calendar invite via email"
              />
              
              {/* Show calendar type selection when instant invite is enabled */}
              {eventFormData.send_instant_invite && (
                <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                  <InputLabel>Calendar Type</InputLabel>
                  <Select
                    value={eventFormData.instant_invite_for}
                    onChange={(e) => handleEventFormChange('instant_invite_for', e.target.value)}
                    label="Calendar Type"
                  >
                    <MenuItem value="Zoroastrian">Zoroastrian</MenuItem>
                    <MenuItem value="Gregorian">Gregorian</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
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
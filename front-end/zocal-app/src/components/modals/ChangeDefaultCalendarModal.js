import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import { updateUserSettings } from '../../store/authSlice';
import { ZOROASTRIAN_CALENDAR_TYPES, ZOROASTRIAN_CALENDAR_TYPES_ENUM } from '../../constants';

const ChangeDefaultCalendarModal = ({ open, onClose, currentCalendarType }) => {
  const dispatch = useDispatch();
  const [selectedCalendar, setSelectedCalendar] = useState(currentCalendarType);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      await dispatch(updateUserSettings({ 
        default_zoro_cal: selectedCalendar 
      })).unwrap();
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update calendar type');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedCalendar(currentCalendarType);
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Change Default Calendar</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3, mt: 1 }}>
          Set default calendar for user account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth>
          <InputLabel>Calendar Type</InputLabel>
          <Select
            value={selectedCalendar}
            label="Calendar Type"
            onChange={(e) => setSelectedCalendar(e.target.value)}
          >
            {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
              <MenuItem key={type} value={ZOROASTRIAN_CALENDAR_TYPES_ENUM[type.toUpperCase()]}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeDefaultCalendarModal;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { updateUserSettings } from '../store/authSlice';
import { calendarTypes } from '../utils/zoroastrianCalendar';

const SettingsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    display_mode: 'light',
    default_zoro_cal: 'Shenshai'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (user && open) {
      const initialData = {
        display_mode: user.display_mode || 'light',
        default_zoro_cal: user.default_zoro_cal || 'Shenshai'
      };
      setFormData(initialData);
      setHasChanges(false);
      setSaveError(null);
    }
  }, [user, open]);

  // Check for changes
  useEffect(() => {
    if (user) {
      const changed = 
        formData.display_mode !== (user.display_mode || 'light') ||
        formData.default_zoro_cal !== (user.default_zoro_cal || 'Shenshai');
      setHasChanges(changed);
    }
  }, [formData, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await dispatch(updateUserSettings(formData)).unwrap();
      onClose();
    } catch (error) {
      setSaveError(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSaveError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          <Typography variant="h6">Settings</Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {(authError || saveError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError || authError}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 300 }}>
          {/* Display Mode */}
          <FormControl fullWidth>
            <InputLabel>Display Mode</InputLabel>
            <Select
              value={formData.display_mode}
              label="Display Mode"
              onChange={(e) => handleInputChange('display_mode', e.target.value)}
              disabled={authLoading || saving}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>

          {/* Default Calendar */}
          <FormControl fullWidth>
            <InputLabel>Default Calendar</InputLabel>
            <Select
              value={formData.default_zoro_cal}
              label="Default Calendar"
              onChange={(e) => handleInputChange('default_zoro_cal', e.target.value)}
              disabled={authLoading || saving}
            >
              <MenuItem value={calendarTypes.SHENSHAI}>Shenshai</MenuItem>
              <MenuItem value={calendarTypes.KADMI}>Kadmi</MenuItem>
              <MenuItem value={calendarTypes.FASLI}>Fasli</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!hasChanges || saving}
          startIcon={saving && <CircularProgress size={20} />}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
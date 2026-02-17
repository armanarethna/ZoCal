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
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close as CloseIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { updateUserSettings } from '../../store/authSlice';
import { calendarTypes } from '../../utils/zoroastrianCalendar';
import { DISPLAY_MODES, DEFAULT_ZORO_CAL_OPTIONS, ZOROASTRIAN_CALENDAR_TYPES } from '../../constants';

// Comprehensive list of global timezones with GMT offsets and friendly names
const TIMEZONE_DATA = [
  { id: 'Pacific/Midway', offset: '(GMT-11:00)', name: 'Midway Island' },
  { id: 'Pacific/Honolulu', offset: '(GMT-10:00)', name: 'Hawaii' },
  { id: 'America/Anchorage', offset: '(GMT-09:00)', name: 'Alaska' },
  { id: 'America/Los_Angeles', offset: '(GMT-08:00)', name: 'Pacific Time (US & Canada)' },
  { id: 'America/Denver', offset: '(GMT-07:00)', name: 'Mountain Time (US & Canada)' },
  { id: 'America/Chicago', offset: '(GMT-06:00)', name: 'Central Time (US & Canada)' },
  { id: 'America/New_York', offset: '(GMT-05:00)', name: 'Eastern Time (US & Canada)' },
  { id: 'America/Halifax', offset: '(GMT-04:00)', name: 'Atlantic Time (Canada)' },
  { id: 'America/St_Johns', offset: '(GMT-03:30)', name: 'Newfoundland' },
  { id: 'America/Sao_Paulo', offset: '(GMT-03:00)', name: 'Brasilia' },
  { id: 'America/Argentina/Buenos_Aires', offset: '(GMT-03:00)', name: 'Buenos Aires' },
  { id: 'Atlantic/South_Georgia', offset: '(GMT-02:00)', name: 'South Georgia' },
  { id: 'Atlantic/Azores', offset: '(GMT-01:00)', name: 'Azores' },
  { id: 'UTC', offset: '(GMT+00:00)', name: 'UTC' },
  { id: 'Europe/London', offset: '(GMT+00:00)', name: 'London' },
  { id: 'Europe/Dublin', offset: '(GMT+00:00)', name: 'Dublin' },
  { id: 'Europe/Paris', offset: '(GMT+01:00)', name: 'Paris' },
  { id: 'Europe/Berlin', offset: '(GMT+01:00)', name: 'Berlin' },
  { id: 'Europe/Rome', offset: '(GMT+01:00)', name: 'Rome' },
  { id: 'Europe/Madrid', offset: '(GMT+01:00)', name: 'Madrid' },
  { id: 'Africa/Lagos', offset: '(GMT+01:00)', name: 'Lagos' },
  { id: 'Europe/Athens', offset: '(GMT+02:00)', name: 'Athens' },
  { id: 'Europe/Helsinki', offset: '(GMT+02:00)', name: 'Helsinki' },
  { id: 'Africa/Cairo', offset: '(GMT+02:00)', name: 'Cairo' },
  { id: 'Africa/Johannesburg', offset: '(GMT+02:00)', name: 'Johannesburg' },
  { id: 'Europe/Moscow', offset: '(GMT+03:00)', name: 'Moscow' },
  { id: 'Asia/Kuwait', offset: '(GMT+03:00)', name: 'Kuwait' },
  { id: 'Asia/Riyadh', offset: '(GMT+03:00)', name: 'Riyadh' },
  { id: 'Asia/Baghdad', offset: '(GMT+03:00)', name: 'Baghdad' },
  { id: 'Asia/Tehran', offset: '(GMT+03:30)', name: 'Tehran' },
  { id: 'Asia/Dubai', offset: '(GMT+04:00)', name: 'Dubai' },
  { id: 'Asia/Muscat', offset: '(GMT+04:00)', name: 'Muscat' },
  { id: 'Asia/Baku', offset: '(GMT+04:00)', name: 'Baku' },
  { id: 'Asia/Kabul', offset: '(GMT+04:30)', name: 'Kabul' },
  { id: 'Asia/Karachi', offset: '(GMT+05:00)', name: 'Karachi' },
  { id: 'Asia/Tashkent', offset: '(GMT+05:00)', name: 'Tashkent' },
  { id: 'Asia/Kolkata', offset: '(GMT+05:30)', name: 'India (Default)' },
  { id: 'Asia/Colombo', offset: '(GMT+05:30)', name: 'Sri Lanka' },
  { id: 'Asia/Kathmandu', offset: '(GMT+05:45)', name: 'Nepal' },
  { id: 'Asia/Dhaka', offset: '(GMT+06:00)', name: 'Bangladesh' },
  { id: 'Asia/Almaty', offset: '(GMT+06:00)', name: 'Kazakhstan' },
  { id: 'Asia/Yangon', offset: '(GMT+06:30)', name: 'Myanmar' },
  { id: 'Asia/Bangkok', offset: '(GMT+07:00)', name: 'Bangkok' },
  { id: 'Asia/Jakarta', offset: '(GMT+07:00)', name: 'Jakarta' },
  { id: 'Asia/Ho_Chi_Minh', offset: '(GMT+07:00)', name: 'Vietnam' },
  { id: 'Asia/Shanghai', offset: '(GMT+08:00)', name: 'China' },
  { id: 'Asia/Hong_Kong', offset: '(GMT+08:00)', name: 'Hong Kong' },
  { id: 'Asia/Singapore', offset: '(GMT+08:00)', name: 'Singapore' },
  { id: 'Asia/Manila', offset: '(GMT+08:00)', name: 'Philippines' },
  { id: 'Australia/Perth', offset: '(GMT+08:00)', name: 'Perth' },
  { id: 'Asia/Seoul', offset: '(GMT+09:00)', name: 'Seoul' },
  { id: 'Asia/Tokyo', offset: '(GMT+09:00)', name: 'Tokyo' },
  { id: 'Australia/Darwin', offset: '(GMT+09:30)', name: 'Darwin' },
  { id: 'Australia/Adelaide', offset: '(GMT+09:30)', name: 'Adelaide' },
  { id: 'Australia/Sydney', offset: '(GMT+10:00)', name: 'Sydney' },
  { id: 'Australia/Melbourne', offset: '(GMT+10:00)', name: 'Melbourne' },
  { id: 'Australia/Brisbane', offset: '(GMT+10:00)', name: 'Brisbane' },
  { id: 'Australia/Hobart', offset: '(GMT+10:00)', name: 'Tasmania' },
  { id: 'Pacific/Guam', offset: '(GMT+10:00)', name: 'Guam' },
  { id: 'Pacific/Noumea', offset: '(GMT+11:00)', name: 'New Caledonia' },
  { id: 'Pacific/Auckland', offset: '(GMT+12:00)', name: 'New Zealand' },
  { id: 'Pacific/Fiji', offset: '(GMT+12:00)', name: 'Fiji' },
  { id: 'Pacific/Tongatapu', offset: '(GMT+13:00)', name: 'Tonga' },
  { id: 'Pacific/Kiritimati', offset: '(GMT+14:00)', name: 'Kiribati' }
];

const SettingsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector(state => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    display_mode: DISPLAY_MODES.LIGHT,
    default_zoro_cal: DEFAULT_ZORO_CAL_OPTIONS.SHENSHAI,
    timezone: 'Asia/Kolkata'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (user && open) {
      const initialData = {
        display_mode: user.display_mode || DISPLAY_MODES.LIGHT,
        default_zoro_cal: user.default_zoro_cal || DEFAULT_ZORO_CAL_OPTIONS.SHENSHAI,
        timezone: user.timezone || 'Asia/Kolkata'
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
        formData.display_mode !== (user.display_mode || DISPLAY_MODES.LIGHT) ||
        formData.default_zoro_cal !== (user.default_zoro_cal || DEFAULT_ZORO_CAL_OPTIONS.SHENSHAI) ||
        formData.timezone !== (user.timezone || 'Asia/Kolkata');
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
      maxWidth={isMobile ? "xs" : "md"}
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : theme.spacing(2),
          maxHeight: isMobile ? '100vh' : '90vh',
          width: isMobile ? '100vw' : 'auto',
          minWidth: isMobile ? 'auto' : '500px'
        }
      }}
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
      
      <DialogContent sx={{ 
        pt: 2, 
        px: isMobile ? 2 : 3,
        pb: isMobile ? 2 : 3
      }}>
        {(authError || saveError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError || authError}
          </Alert>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Display Mode */}
          <FormControl fullWidth sx={{ mt: isMobile ? 2 : 1 }}>
            <InputLabel>Display Mode</InputLabel>
            <Select
              value={formData.display_mode}
              label="Display Mode"
              onChange={(e) => handleInputChange('display_mode', e.target.value)}
              disabled={authLoading || saving}
              sx={{ width: '100%' }}
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
              sx={{ width: '100%' }}
            >
              {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                <MenuItem key={type} value={calendarTypes[type.toUpperCase()]}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Timezone Selector */}
          <FormControl fullWidth>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={formData.timezone}
              label="Timezone"
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              disabled={authLoading || saving}
              sx={{ width: '100%' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {TIMEZONE_DATA.map((timezone) => (
                <MenuItem key={timezone.id} value={timezone.id}>
                  {timezone.offset} {timezone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: isMobile ? 2 : 3, 
        pb: 2,
        gap: isMobile ? 1 : 0
      }}>
        <Button 
          onClick={handleClose}
          disabled={saving}
          fullWidth={isMobile}
          sx={{ minWidth: isMobile ? 'auto' : '80px' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!hasChanges || saving}
          startIcon={saving && <CircularProgress size={20} />}
          fullWidth={isMobile}
          sx={{ minWidth: isMobile ? 'auto' : '80px' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
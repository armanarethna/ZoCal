import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Components
import EventsMobileView from './EventsMobileView';
import EventsDesktopView from './EventsDesktopView';

// Utils
import { 
  calendarTypes,
  sortEventsByZoroastrianOccurrence
} from '../../utils/zoroastrianCalendar';
import { ZOROASTRIAN_CALENDAR_TYPES } from '../../constants';

const ZoroastrianEventTable = (props) => {
  const { 
    events = [], 
    loading, 
    error, 
    onEditEvent, 
    onDeleteEvent,
    onAddEvent
  } = props;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tooltipOpen, setTooltipOpen] = useState(false);
  
  
  const getInitialCalendarType = useCallback(() => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return calendarTypes.SHENSHAI;
  }, [isAuthenticated, user?.default_zoro_cal]);
  
  const [calendarType, setCalendarType] = useState(getInitialCalendarType());

  const handleTooltipClick = () => {
    if (isMobile) {
      setTooltipOpen(!tooltipOpen);
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  // Update calendar type when user changes or authentication status changes
  useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated, getInitialCalendarType]);

  // Get calendar type display name
  const getCalendarTypeDisplayName = () => {
    // calendarType is already a string like 'Shenshai', 'Kadmi', 'Fasli'
    return calendarType || 'Shenshai';
  };

  // Sort events by Zoroastrian next occurrence (least days remaining first)
  const sortedEvents = sortEventsByZoroastrianOccurrence(
    Array.isArray(events) ? [...events] : [], 
    calendarType
  );

  return (
    <Container maxWidth="lg">
      {/* Sticky Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: isMobile ? 96 : 128, 
        zIndex: 1200, 
        backgroundColor: 'var(--background-default)',
        pt: 2,
        pb: 2,
        borderBottom: 1,
        borderColor: 'var(--divider)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Events
            </Typography>
            <Tooltip 
              title="The Events tab displays your saved events including calculated Zoroastrian calendar details. Events are sorted by their next occurrence date for Zoroastrian event date. Calendar type determines which Zoroastrian calendar system is used."
              arrow
              placement="top"
              open={isMobile ? tooltipOpen : undefined}
              onClose={handleTooltipClose}
              disableHoverListener={isMobile}
              disableFocusListener={isMobile}
              disableTouchListener={isMobile}
            >
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={handleTooltipClick}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: isMobile ? 120 : 180 }}>
              <InputLabel>Calendar Type</InputLabel>
              <Select
                value={calendarType}
                label="Calendar Type"
                onChange={(e) => setCalendarType(e.target.value)}
              >
                {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                  <MenuItem key={type} value={calendarTypes[type.toUpperCase()]}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddEvent}
              sx={{
                fontSize: '1rem',
                minWidth: '140px',
                px: 3
              }}
            >
              Add Event
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Content with spacing */}
      <Box sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : sortedEvents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'var(--text-secondary)' }}>
            Add new event to get started
          </Typography>
        </Paper>
      ) : isMobile ? (
        <EventsMobileView 
          sortedEvents={sortedEvents}
          calendarType={calendarType}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      ) : (
        <EventsDesktopView 
          sortedEvents={sortedEvents}
          calendarType={calendarType}
          getCalendarTypeDisplayName={getCalendarTypeDisplayName}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      )}
    </Box>
    </Container>
  );
};

export default ZoroastrianEventTable;
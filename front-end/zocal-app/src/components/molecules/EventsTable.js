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
  Link,
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
import ChangeDefaultCalendarModal from '../modals/ChangeDefaultCalendarModal';

// Utils
import { 
  calendarTypes,
  sortEventsByZoroastrianOccurrence
} from '../../utils/zoroastrianCalendar';
import { TOOLTIP_TEXT } from '../../constants';

const EventsTable = (props) => {
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
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  
  
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
            <Tooltip 
              title={TOOLTIP_TEXT.EVENTS_TAB}
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Events: {getCalendarTypeDisplayName()}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={() => setCalendarModalOpen(true)}
              sx={{ 
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark'
                }
              }}
            >
              Change
            </Link>
          </Box>
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
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      )}
    </Box>
    
    <ChangeDefaultCalendarModal
      open={calendarModalOpen}
      onClose={() => setCalendarModalOpen(false)}
      currentCalendarType={calendarType}
    />
    </Container>
  );
};

export default EventsTable;
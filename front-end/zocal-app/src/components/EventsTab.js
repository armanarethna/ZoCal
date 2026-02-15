import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Fab, 
  ToggleButton, 
  ToggleButtonGroup, 
  Typography,
  Paper,
  Container
} from '@mui/material';
import { 
  Add as AddIcon, 
  CalendarToday as GregorianIcon, 
  Event as ZoroastrianIcon,
  EventNote as EventIcon
} from '@mui/icons-material';

// Components
import EventModal from './EventModal';
import GregorianEventTable from './GregorianEventTable';
import ZoroastrianEventTable from './ZoroastrianEventTable';

// Redux actions
import { getAllEvents } from '../store/eventsSlice';

const EventsTab = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { events = [], loading: eventsLoading, error: eventsError } = useSelector(state => state.events);

  // Table view state
  const [viewType, setViewType] = useState('gregorian');

  // Event modal states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Load events when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getAllEvents());
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle view type change
  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Handle opening event modal for adding
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventModalOpen(true);
  };

  // Handle opening event modal for editing
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventModalOpen(true);
  };

  // Handle delete event click
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  // Close event modal
  const handleCloseEventModal = () => {
    setEventModalOpen(false);
    setEditingEvent(null);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEventToDelete(null);
  };



  return (
    <Box sx={{ pb: 3 }}>
      {!isAuthenticated ? (
        // Show message box when not authenticated
        <Container maxWidth="sm">
          <Paper 
            sx={{ 
              p: 4, 
              mt: 2, 
              textAlign: 'center',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              border: (theme) => `1px solid ${theme.palette.divider}`
            }}
          >
            <EventIcon 
              sx={{ 
                fontSize: 60, 
                color: 'primary.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Event Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign Up / Log In to save and view Gregorian and Zoroastrian events
            </Typography>
          </Paper>
        </Container>
      ) : (
        <Box>
          {/* Table Type Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewTypeChange}
              aria-label="calendar type"
            >
              <ToggleButton value="gregorian" aria-label="gregorian calendar">
                <GregorianIcon sx={{ mr: 1 }} />
                Gregorian
              </ToggleButton>
              <ToggleButton value="zoroastrian" aria-label="zoroastrian calendar">
                <ZoroastrianIcon sx={{ mr: 1 }} />
                Zoroastrian
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Render appropriate table based on view type */}
          {viewType === 'gregorian' ? (
            <GregorianEventTable
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteClick}
            />
          ) : (
            <ZoroastrianEventTable
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteClick}
            />
          )}
        </Box>
      )}
      
      {/* Floating Add Button - only show when authenticated */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="add event"
          onClick={handleAddEvent}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      )}
      
      {/* Event Modal */}
      <EventModal
        open={eventModalOpen}
        onClose={handleCloseEventModal}
        editingEvent={editingEvent}
        deleteModalOpen={deleteModalOpen}
        onDeleteModalClose={handleCloseDeleteModal}
        eventToDelete={eventToDelete}
      />
    </Box>
  );
};

export default EventsTab;
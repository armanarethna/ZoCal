import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { 
  Event as EventIcon
} from '@mui/icons-material';
import EventModal from '../modals/EventModal';
import EventsTable from '../molecules/EventsTable';
import { getAllEvents } from '../../store/eventsSlice';

const EventsTab = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { events = [], loading: eventsLoading, error: eventsError } = useSelector(state => state.events);

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
        <Container maxWidth="sm">
          <Paper 
            sx={{ 
              p: 4, 
              mt: 2, 
              textAlign: 'center',
              backgroundColor: 'var(--event-card-bg)',
              border: (theme) => `1px solid ${theme.palette.divider}`
            }}
          >
            <EventIcon 
              sx={{ 
                fontSize: 60, 
                color: 'var(--primary-main)', 
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Events
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mt: 2, mb:1 , fontWeight: 'bold' }}>
              Log In or Sign Up to:
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 0.5 }}>
                Save and manage your events
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 0.5 }}>
                View Zoroastrian events details
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                Setup event reminders
              </Typography>
            </Box>
          </Paper>
        </Container>
      ) : (
        <EventsTable
          events={events}
          loading={eventsLoading}
          error={eventsError}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteClick}
          onAddEvent={handleAddEvent}
        />
      )}
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
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { 
  EventNote as EventIcon
} from '@mui/icons-material';

// Components
import EventModal from '../modals/EventModal';
import GregorianEventTable from '../molecules/GregorianEventTable';
import ZoroastrianEventTable from '../molecules/ZoroastrianEventTable';

// Redux actions
import { getAllEvents } from '../../store/eventsSlice';

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
  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
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
              Event Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
              Sign Up / Log In to save and view Gregorian and Zoroastrian events
            </Typography>
          </Paper>
        </Container>
      ) : (
        <>
          {/* Render appropriate table based on view type */}
          {viewType === 'gregorian' ? (
            <GregorianEventTable
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteClick}
              onAddEvent={handleAddEvent}
              viewType={viewType}
              onViewTypeChange={handleViewTypeChange}
            />
          ) : (
            <ZoroastrianEventTable
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteClick}
              onAddEvent={handleAddEvent}
              viewType={viewType}
              onViewTypeChange={handleViewTypeChange}
            />
          )}
        </>
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
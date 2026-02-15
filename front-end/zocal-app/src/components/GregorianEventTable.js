import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Utils
import {
  calculateYears,
  calculateDaysRemaining,
  formatDisplayDate,
  sortEventsByNextOccurrence
} from '../utils/eventUtils';

const GregorianEventTable = ({ 
  events = [], 
  loading, 
  error, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  // Sort events by next occurrence
  const sortedEvents = sortEventsByNextOccurrence(Array.isArray(events) ? [...events] : []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Gregorian Events</Typography>
      </Box>
      
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
          <Typography variant="h6" color="text.secondary">
            Add new event to get started
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ 
            '& .MuiTableCell-root': { 
              color: 'text.primary',
              fontSize: '1.1rem'
            },
            '& .MuiTableHead .MuiTableCell-root': {
              fontSize: '1.2rem',
              fontWeight: 'bold'
            },
            '& .action-column': {
              padding: '8px 4px',
              width: '48px',
              maxWidth: '48px'
            },
            '& .data-column': {
              width: '17%',
              maxWidth: '17%'
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell className="data-column">Name</TableCell>
                <TableCell className="data-column">Category</TableCell>
                <TableCell className="data-column">Date</TableCell>
                <TableCell className="data-column">Years</TableCell>
                <TableCell className="data-column">Days Left</TableCell>
                <TableCell className="data-column">Before Sunrise</TableCell>
                <TableCell className="action-column"></TableCell>
                <TableCell className="action-column"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="data-column">{event.name}</TableCell>
                  <TableCell className="data-column">{event.category}</TableCell>
                  <TableCell className="data-column">{formatDisplayDate(event.eventDate)}</TableCell>
                  <TableCell className="data-column">{calculateYears(event.eventDate)}</TableCell>
                  <TableCell className="data-column">{calculateDaysRemaining(event.eventDate)}</TableCell>
                  <TableCell className="data-column">{event.beforeSunrise ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="action-column">
                    <IconButton
                      color="primary"
                      onClick={() => onEditEvent(event)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell className="action-column">
                    <IconButton
                      color="error"
                      onClick={() => onDeleteEvent(event)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default GregorianEventTable;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Utils
import {
  formatDisplayDate
} from '../utils/eventUtils';
import { 
  calendarTypes,
  convertEventToZoroastrian,
  calculateZoroastrianDaysRemaining,
  calculateNextGregorianDate,
  sortEventsByZoroastrianOccurrence
} from '../utils/zoroastrianCalendar';

const ZoroastrianEventTable = ({ 
  events = [], 
  loading, 
  error, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Use user's default calendar preference if authenticated, otherwise default to Shenshai
  const getInitialCalendarType = () => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return calendarTypes.SHENSHAI;
  };
  
  const [calendarType, setCalendarType] = useState(getInitialCalendarType());

  // Update calendar type when user changes or authentication status changes
  useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated]);

  // Sort events by Zoroastrian next occurrence (least days remaining first)
  const sortedEvents = sortEventsByZoroastrianOccurrence(
    Array.isArray(events) ? [...events] : [], 
    calendarType
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Zoroastrian Events</Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Calendar</InputLabel>
          <Select
            value={calendarType}
            label="Calendar"
            onChange={(e) => setCalendarType(e.target.value)}
          >
            <MenuItem value={calendarTypes.SHENSHAI}>Shenshai</MenuItem>
            <MenuItem value={calendarTypes.KADMI}>Kadmi</MenuItem>
            <MenuItem value={calendarTypes.FASLI}>Fasli</MenuItem>
          </Select>
        </FormControl>
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
              width: '16.66%',
              maxWidth: '16.66%'
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell className="data-column">Name</TableCell>
                <TableCell className="data-column">Category</TableCell>
                <TableCell className="data-column">Roj</TableCell>
                <TableCell className="data-column">Mah</TableCell>
                <TableCell className="data-column">Falls On</TableCell>
                <TableCell className="data-column">Days Left</TableCell>
                <TableCell className="action-column"></TableCell>
                <TableCell className="action-column"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEvents.map((event) => {
                const zoroEvent = convertEventToZoroastrian(event, calendarType);
                return (
                  <TableRow key={event._id}>
                    <TableCell className="data-column">{event.name}</TableCell>
                    <TableCell className="data-column">{event.category}</TableCell>
                    <TableCell className="data-column">
                      {zoroEvent.roj}
                    </TableCell>
                    <TableCell className="data-column">
                      {zoroEvent.isGatha ? 'GATHA' : zoroEvent.mah}
                    </TableCell>
                    <TableCell className="data-column">{calculateNextGregorianDate(event, calendarType, formatDisplayDate)}</TableCell>
                    <TableCell className="data-column">{calculateZoroastrianDaysRemaining(event, calendarType)}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ZoroastrianEventTable;
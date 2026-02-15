import React, { useState, useEffect, useCallback } from 'react';
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
  MenuItem,
  Card,
  CardContent,
  Grid,
  Stack,
  useMediaQuery,
  useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use user's default calendar preference if authenticated, otherwise default to Shenshai
  const getInitialCalendarType = useCallback(() => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return calendarTypes.SHENSHAI;
  }, [isAuthenticated, user?.default_zoro_cal]);
  
  const [calendarType, setCalendarType] = useState(getInitialCalendarType());

  // Update calendar type when user changes or authentication status changes
  useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated, getInitialCalendarType]);

  // Sort events by Zoroastrian next occurrence (least days remaining first)
  const sortedEvents = sortEventsByZoroastrianOccurrence(
    Array.isArray(events) ? [...events] : [], 
    calendarType
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Events</Typography>
        
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
      ) : isMobile ? (
        // Mobile card layout
        <Stack spacing={2}>
          {sortedEvents.map((event) => {
            const zoroEvent = convertEventToZoroastrian(event, calendarType);
            const fallsOnText = calculateNextGregorianDate(event, calendarType, formatDisplayDate);
            const daysRemaining = calculateZoroastrianDaysRemaining(event, calendarType);
            const daysText = daysRemaining === "Today" ? "Today" : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} to go`;
            return (
              <Card key={event._id} variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    {/* Column 1: Name, Category, Gregorian Date */}
                    <Grid item xs={5}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {event.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.category}
                        </Typography>
                        <Typography variant="body2">
                          {formatDisplayDate(event.eventDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    {/* Column 2: Roj, Mah, Occurs, Days Left */}
                    <Grid item xs={5}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          {zoroEvent.roj} (R)
                        </Typography>
                        <Typography variant="body2">
                          {zoroEvent.isGatha ? 'GATHA (M)' : `${zoroEvent.mah} (M)`}
                        </Typography>
                        <Typography variant="body2">
                          Occurs: {fallsOnText}
                        </Typography>
                        <Typography variant="body2">
                          {daysText}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    {/* Column 3: Action Buttons */}
                    <Grid item xs={2}>
                      <Stack spacing={0.5} alignItems="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEditEvent(event)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeleteEvent(event)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      ) : (
        // Desktop table layout
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
              width: '14.28%',
              maxWidth: '14.28%'
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell className="data-column">Name</TableCell>
                <TableCell className="data-column">Category</TableCell>
                <TableCell className="data-column">Date</TableCell>
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
                    <TableCell className="data-column">{formatDisplayDate(event.eventDate)}</TableCell>
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
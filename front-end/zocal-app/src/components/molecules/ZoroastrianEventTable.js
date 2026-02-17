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
  useTheme,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Utils
import {
  formatDisplayDate
} from '../../utils/eventUtils';
import { 
  calendarTypes,
  convertEventToZoroastrian,
  calculateZoroastrianDaysRemaining,
  calculateNextGregorianDate,
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
    onAddEvent,
    viewType,
    onViewTypeChange
  } = props;
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
            <FormControl size="medium" sx={{ minWidth: isMobile ? 150 : 180 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={viewType}
                label="Event Type"
                onChange={onViewTypeChange}
              >
                <MenuItem value="gregorian">Gregorian</MenuItem>
                <MenuItem value="zoroastrian">Zoroastrian</MenuItem>
              </Select>
            </FormControl>
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
          </Box>
          <Button
            variant="contained"
            startIcon={!isMobile ? <AddIcon /> : null}
            onClick={onAddEvent}
            sx={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              minWidth: isMobile ? 'auto' : '140px',
              px: isMobile ? 1 : 3,
              py: isMobile ? 1 : undefined,
              borderRadius: isMobile ? '50%' : undefined,
              aspectRatio: isMobile ? '1' : 'auto'
            }}
          >
            {isMobile ? <AddIcon /> : 'Add Event'}
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
        // Mobile card layout
        <Stack spacing={2}>
          {sortedEvents.map((event) => {
            const zoroEvent = convertEventToZoroastrian(event, calendarType);
            const fallsOnText = calculateNextGregorianDate(event, calendarType, formatDisplayDate);
            const daysRemaining = calculateZoroastrianDaysRemaining(event, calendarType);
            // Parse the number from the formatted string if it's not "Today" or "N/A"
            let daysText;
            if (daysRemaining === "Today" || daysRemaining === "N/A") {
              daysText = daysRemaining;
            } else {
              const daysNumber = parseInt(daysRemaining.split(' ')[0]);
              daysText = `in ${daysNumber} ${daysNumber === 1 ? 'day' : 'days'}`;
            }
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
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
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
                          sx={{ color: 'var(--primary-main)' }}
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
                <TableCell className="data-column">Days Remaining</TableCell>
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
                    <TableCell className="data-column">{(() => {
                      const daysRemaining = calculateZoroastrianDaysRemaining(event, calendarType);
                      if (daysRemaining === "Today" || daysRemaining === "N/A") {
                        return daysRemaining;
                      } else {
                        const daysNumber = parseInt(daysRemaining.split(' ')[0]);
                        return `${daysNumber} ${daysNumber === 1 ? 'day' : 'days'}`;
                      }
                    })()}</TableCell>
                    <TableCell className="action-column">
                      <IconButton
                        sx={{ color: 'var(--primary-main)' }}
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
    </Box>
    </Container>
  );
};

export default ZoroastrianEventTable;
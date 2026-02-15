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
  IconButton,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sort events by next occurrence
  const sortedEvents = sortEventsByNextOccurrence(Array.isArray(events) ? [...events] : []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Events</Typography>
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
            const years = calculateYears(event.eventDate);
            const days = calculateDaysRemaining(event.eventDate);
            const yearsText = `${years} ${years === 1 ? 'year' : 'years'}`;
            const daysText = days === "Today" ? "Today" : `in ${days} ${days === 1 ? 'day' : 'days'}`;
            return (
              <Card key={event._id} variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    {/* Column 1: Name, Category, Date */}
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
                    
                    {/* Column 2: Years, Days */}
                    <Grid item xs={5}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ opacity: 0 }}>
                          {/* Empty line to align with name */}
                        </Typography>
                        <Typography variant="body2">
                          {yearsText}
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
                <TableCell className="data-column">Days Remaining</TableCell>
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
                  <TableCell className="data-column">{(() => {
                    const days = calculateDaysRemaining(event.eventDate);
                    return days === "Today" ? "Today" : `${days} ${days === 1 ? 'day' : 'days'}`;
                  })()}</TableCell>
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
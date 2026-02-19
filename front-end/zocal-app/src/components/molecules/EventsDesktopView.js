import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Utils
import {
  formatDisplayDate,
  calculateDaysRemaining,
  calculateYears
} from '../../utils/eventUtils';
import { 
  convertEventToZoroastrian,
  calculateZoroastrianDaysRemaining,
  calculateNextGregorianDate
} from '../../utils/zoroastrianCalendar';

const EventsDesktopView = ({ 
  sortedEvents, 
  calendarType, 
  getCalendarTypeDisplayName,
  onEditEvent, 
  onDeleteEvent 
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ 
        '& .MuiTableCell-root': { 
          color: 'text.primary',
          fontSize: '1.1rem',
          verticalAlign: 'top'
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
        '& .name-column': {
          width: '20%',
          maxWidth: '20%'
        },
        '& .category-column': {
          width: '15%',
          maxWidth: '15%'
        },
        '& .date-column': {
          width: '15%',
          maxWidth: '15%'
        },
        '& .details-column': {
          width: '20%',
          maxWidth: '20%'
        },
        '& .falls-on-column': {
          width: '20%',
          maxWidth: '20%'
        }
      }}>
        <TableHead>
          <TableRow>
            <TableCell className="name-column">
              <span style={{ color: 'var(--color-white)' }}>Name</span>
            </TableCell>
            <TableCell className="category-column">
              <span style={{ color: 'var(--color-white)' }}>Category</span>
            </TableCell>
            <TableCell className="date-column">
              <span style={{ color: 'var(--color-white)' }}>Date</span>
            </TableCell>
            <TableCell className="details-column">{getCalendarTypeDisplayName()} Details</TableCell>
            <TableCell className="fallson-column">
              <span style={{ color: 'var(--color-white)' }}>Falls On</span>
            </TableCell>
            <TableCell className="action-column"></TableCell>
            <TableCell className="action-column"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEvents.map((event) => {
            const zoroEvent = convertEventToZoroastrian(event, calendarType);
            const fallsOnText = calculateNextGregorianDate(event, calendarType, formatDisplayDate);
            const gregorianDaysRemaining = calculateDaysRemaining(event.eventDate);
            const zoroastrianDaysRemaining = calculateZoroastrianDaysRemaining(event, calendarType);
            let gregorianDaysText;
            let zoroastrianDaysText;
            
            // Handle Gregorian days remaining
            if (gregorianDaysRemaining === "Today") {
              gregorianDaysText = "Today";
            } else {
              const gDaysNumber = parseInt(gregorianDaysRemaining);
              gregorianDaysText = `in ${gDaysNumber} ${gDaysNumber === 1 ? 'day' : 'days'}`;
            }
            
            // Handle Zoroastrian days remaining
            if (zoroastrianDaysRemaining === "Today" || zoroastrianDaysRemaining === "N/A") {
              zoroastrianDaysText = zoroastrianDaysRemaining;
            } else {
              const zDaysNumber = parseInt(zoroastrianDaysRemaining.split(' ')[0]);
              zoroastrianDaysText = `in ${zDaysNumber} ${zDaysNumber === 1 ? 'day' : 'days'}`;
            }
            return (
              <TableRow key={event._id}>
                <TableCell className="name-column">{event.name}</TableCell>
                <TableCell className="category-column">
                  <Box>
                    <Typography component="div" variant="body1">
                      {event.category}
                    </Typography>
                    <Typography component="div" variant="body1">
                      ({calculateYears(event.eventDate)} years)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="date-column">
                  <Box>
                    <Typography component="div">
                      {formatDisplayDate(event.eventDate)}
                    </Typography>
                    <Typography component="div" variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                      {gregorianDaysText}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="details-column">
                  <Box>
                    <Typography component="div" variant="body1">
                      {zoroEvent.roj} (R)
                    </Typography>
                    <Typography component="div" variant="body1">
                      {zoroEvent.isGatha ? 'GATHA (M)' : `${zoroEvent.mah} (M)`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="falls-on-column">
                  <Box>
                    <Typography component="div">
                      {fallsOnText}
                    </Typography>
                    <Typography component="div" variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                      {zoroastrianDaysText}
                    </Typography>
                  </Box>
                </TableCell>
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
  );
};

export default EventsDesktopView;
import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  IconButton
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

const EventsMobileView = ({ 
  sortedEvents, 
  calendarType, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  return (
    <Stack spacing={2}>
      {sortedEvents.map((event) => {
        const zoroEvent = convertEventToZoroastrian(event, calendarType);
        const fallsOnText = calculateNextGregorianDate(event, calendarType, formatDisplayDate);
        const gregorianDaysRemaining = calculateDaysRemaining(event.eventDate);
        const zoroastrianDaysRemaining = calculateZoroastrianDaysRemaining(event, calendarType);
        // Parse the number from the formatted string if it's not "Today" or "N/A"
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
          <Card key={event._id} variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {/* Column 1: Name, Category, Date (2 lines) */}
                <Grid item xs={5}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {event.name}
                    </Typography>
                    <Typography variant="body2">
                      {event.category} ({calculateYears(event.eventDate)} {calculateYears(event.eventDate) === 1 ? 'year' : 'years'})
                    </Typography>
                    <Typography variant="body2">
                      {formatDisplayDate(event.eventDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {gregorianDaysText}
                    </Typography>
                  </Stack>
                </Grid>
                
                {/* Column 2: Zoroastrian Details */}
                <Grid item xs={5}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {zoroEvent.isGatha ? zoroEvent.roj : `${zoroEvent.roj} (R)`}
                    </Typography>
                    <Typography variant="body2">
                      {zoroEvent.isGatha ? 'GATHA' : `${zoroEvent.mah} (M)`}
                    </Typography>
                    <Typography variant="body2">
                      {fallsOnText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {zoroastrianDaysText}
                    </Typography>
                  </Stack>
                </Grid>
                
                {/* Column 3: Action Buttons */}
                <Grid item xs={2}>
                  <Stack spacing={0.5} alignItems="center" justifyContent="center">
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
  );
};

export default EventsMobileView;
import React from 'react';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { gregorianToZoroastrian } from '../../utils/zoroastrianCalendar';

const CalendarTile = ({ dayObj, calendarType }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { date, isCurrentMonth, isToday: isDayToday } = dayObj;
  const zoroastrianDate = gregorianToZoroastrian(date, calendarType);
  
  // Check if this is the first roj of any mah
  const isFirstRojOfMah = !zoroastrianDate.isGatha && zoroastrianDate.rojIndex === 0;
  const isFirstRojOfFirstMah = isFirstRojOfMah && zoroastrianDate.mahIndex === 0;
  const isFirstRojOfOtherMah = isFirstRojOfMah && zoroastrianDate.mahIndex > 0;
  
  return (
    <Card 
      elevation={isDayToday ? 3 : 1}
      sx={{ 
        minHeight: isMobile ? 45 : 75,
        backgroundColor: isDayToday 
          ? 'var(--primary-main)'
          : (isCurrentMonth && isFirstRojOfFirstMah)
            ? 'var(--success-light)'  // Green for first roj of Fravardin
          : (isCurrentMonth && isFirstRojOfOtherMah)
            ? 'var(--warning-light)'  // Orange/amber for first roj of other mahs
          : (isCurrentMonth && zoroastrianDate.isGatha)
            ? 'var(--calendar-gatha-bg)'
            : isCurrentMonth 
              ? 'var(--background-paper)'
              : 'var(--grey-100)',
        border: isDayToday ? 2 : 1,
        borderColor: isDayToday ? 'primary.dark' : 'divider',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <CardContent sx={{ 
        p: isMobile ? 0.25 : 0.5, 
        '&:last-child': { pb: isMobile ? 0.25 : 0.5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%'
      }}>
        {isCurrentMonth ? (
          <>
            {/* Gregorian Date */}
            <Typography 
              variant={isMobile ? "body2" : "h6"} 
              fontWeight={isDayToday ? 'bold' : 'normal'}
              color={(isDayToday || isFirstRojOfFirstMah || isFirstRojOfOtherMah || zoroastrianDate.isGatha) ? 'var(--color-white)' : 'var(--primary-main)'}
              align="center"
              sx={{ 
                mb: isMobile ? 0.25 : 0.5,
                fontSize: isMobile ? '0.75rem' : '1.25rem',
                lineHeight: 1
              }}
            >
              {format(date, 'd')}
            </Typography>
            
            {/* Zoroastrian Date */}
            <Typography 
              variant="caption" 
              display="block"
              color={(isDayToday || isFirstRojOfFirstMah || isFirstRojOfOtherMah || zoroastrianDate.isGatha)
                ? 'white' 
                : 'text.primary'
              }
              align="center"
              sx={{ 
                fontSize: isMobile ? '0.5rem' : '0.65rem',
                lineHeight: isMobile ? 1.1 : 1.2,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {zoroastrianDate.isGatha ? (
                `${zoroastrianDate.roj} (G)`
              ) : (
                <>
                  {zoroastrianDate.roj} (R)
                  <br />
                  {zoroastrianDate.mah} (M)
                </>
              )}
            </Typography>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CalendarTile;
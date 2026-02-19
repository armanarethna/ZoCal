import React from 'react';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { gregorianToZoroastrian, zoroDayType } from '../../utils/zoroastrianCalendar';
import ZoroastrianTooltip from './ZoroastrianTooltip';
import { useTooltip } from '../../contexts/TooltipContext';

const CalendarTile = ({ dayObj, calendarType }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { openTooltip, closeTooltip, isOpen } = useTooltip();
  
  const { date, isCurrentMonth, isToday: isDayToday } = dayObj;
  const zoroastrianDate = gregorianToZoroastrian(date, calendarType);
  const dayType = zoroDayType(zoroastrianDate);
  
  // Create unique ID for this tile
  const tileId = `${format(date, 'yyyy-MM-dd')}-${calendarType}`;
  const tooltipOpen = isOpen(tileId);
  
  // Check if this tile should have white text (special background colors or active states)
  const shouldHaveWhiteText = dayType !== 'Default' || (isMobile && tooltipOpen && isCurrentMonth);
  
  // For desktop hover, we'll handle text color in sx prop since we can't detect hover in JS
  
  // Handle mobile click
  const handleMobileClick = () => {
    if (isMobile && isCurrentMonth) {
      if (tooltipOpen) {
        closeTooltip();
      } else {
        openTooltip(tileId);
      }
    }
  };
  
  // Handle mobile tooltip close
  const handleTooltipClose = () => {
    closeTooltip();
  };
  
  const getCalendarTileBackgroundColor = () => {
    if (!isCurrentMonth) return 'var(--grey-100)';
    
    switch (dayType) {
      case 'Navroze':
        return 'var(--success-light)'; // Green for Navroze (first day of year)
      case 'HormuzRoj':
        return 'var(--warning-light)'; // Orange/amber for first day of other months
      case 'Gatha':
        return 'var(--calendar-gatha-bg)';
      default:
        return 'var(--background-paper)';
    }
  };
  
  return (
    <ZoroastrianTooltip
      date={date}
      zoroastrianDate={zoroastrianDate}
      open={isMobile ? tooltipOpen : undefined}
      onClose={handleTooltipClose}
    >
      <Card 
        elevation={isDayToday ? 3 : 1}
        onClick={handleMobileClick}
        sx={{ 
          minHeight: isMobile ? 45 : 75,
          backgroundColor: (isMobile && tooltipOpen && isCurrentMonth) 
            ? 'primary.main' 
            : getCalendarTileBackgroundColor(),
          border: isDayToday ? 2 : 1,
          borderColor: isDayToday ? 'primary.dark' : 'divider',
          transition: 'all 0.2s ease-in-out',
          cursor: isMobile && isCurrentMonth ? 'pointer' : 'default',
          '&:hover': {
            transform: isCurrentMonth ? 'scale(1.02)' : 'none',
            boxShadow: isCurrentMonth ? theme.shadows[4] : theme.shadows[1],
            backgroundColor: !isMobile && isCurrentMonth ? 'primary.main' : undefined,
            '& .MuiTypography-root': {
              color: !isMobile && isCurrentMonth ? 'white !important' : undefined
            }
          }
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
              color={shouldHaveWhiteText ? 'var(--color-white)' : 'var(--primary-main)'}
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
              fontWeight={isDayToday ? 'bold' : 'normal'}
              color={shouldHaveWhiteText ? 'white' : 'text.primary'}
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
    </ZoroastrianTooltip>
  );
};

export default CalendarTile;
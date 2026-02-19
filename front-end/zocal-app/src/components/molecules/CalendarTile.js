import React from 'react';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { gregorianToZoroastrian, zoroDayType, getSpecialDateInfo } from '../../utils/zoroastrianCalendar';
import ZoroastrianTooltip from './ZoroastrianTooltip';
import { useTooltip } from '../../contexts/TooltipContext';

const CalendarTile = ({ dayObj, calendarType }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { openTooltip, closeTooltip, isOpen } = useTooltip();
  
  const { date, isCurrentMonth, isToday: isDayToday } = dayObj;
  const zoroastrianDate = gregorianToZoroastrian(date, calendarType);
  const dayType = zoroDayType(zoroastrianDate, date, calendarType);
  const specialDateInfo = getSpecialDateInfo(zoroastrianDate, date, calendarType);
  
  // Create unique ID for this tile
  const tileId = `${format(date, 'yyyy-MM-dd')}-${calendarType}`;
  const tooltipOpen = isOpen(tileId);
  
  // Check if this tile should have white text (special background colors or active states)
  const shouldHaveWhiteText = dayType === 'Gatha' || 
                             dayType === 'nowruz-zoroastrian' || 
                             dayType === 'nowruz-gregorian' || 
                             dayType === 'khordad-saal' ||
                             dayType === 'zarthost-no-diso' ||
                             dayType === 'Muktad' ||
                             (isMobile && tooltipOpen && isCurrentMonth);
  
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
      case 'Gatha':
        return 'var(--calendar-gatha-bg)';
      case 'nowruz-zoroastrian':
      case 'nowruz-gregorian':
        return 'var(--calendar-nowruz-bg)';
      case 'khordad-saal':
        return 'var(--calendar-khordad-saal-bg)';
      case 'zarthost-no-diso':
        return 'var(--calendar-zarthost-bg)';
      case 'Muktad':
        return 'var(--calendar-muktad-bg)';
      default:
        return 'var(--background-paper)';
    }
  };

  const getCalendarTileBorderColor = () => {
    if (isDayToday) return 'primary.dark';
    
    // Only apply special borders for tiles in current month
    if (isCurrentMonth) {
      switch (dayType) {
        case 'jashan':
          return 'var(--calendar-jashan-border)';
        case 'first-day-month':
          return 'var(--calendar-first-day-border)';
        default:
          return 'divider';
      }
    }
    
    return 'divider';
  };

  const getCalendarTileBorderWidth = () => {
    if (isDayToday) return 2;
    
    // Only apply special borders for tiles in current month
    if (isCurrentMonth) {
      switch (dayType) {
        case 'jashan':
        case 'first-day-month':
          return 3; // Thicker border for special cases
        default:
          return 1;
      }
    }
    
    return 1;
  };
  
  return (
    <ZoroastrianTooltip
      date={date}
      zoroastrianDate={zoroastrianDate}
      specialDateInfo={specialDateInfo}
      dayType={dayType}
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
          border: getCalendarTileBorderWidth(),
          borderColor: getCalendarTileBorderColor(),
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
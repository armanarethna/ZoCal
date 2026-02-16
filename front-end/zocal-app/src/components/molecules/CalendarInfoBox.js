import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { CALENDAR_COMMON_INFO, CALENDAR_SPECIFIC_INFO } from '../../constants';

const CalendarInfoBox = ({ calendarType }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: isMobile ? 1 : 2, 
        mt: isMobile ? 0.5 : 1,
        backgroundColor: 'var(--background-paper)',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Box>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          fontWeight="bold" 
          sx={{ mb: 1, color: 'var(--text-primary)' }}
        >
          {calendarType} Calendar:
        </Typography>
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          sx={{ 
            color: 'var(--text-secondary)',
            pl: 1,
            mb: 0.5
          }}
        >
          • {CALENDAR_SPECIFIC_INFO[calendarType]?.description}
        </Typography>
      </Box>

      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
        {Object.values(CALENDAR_COMMON_INFO).map((info, index) => (
          <Typography 
            key={index}
            variant={isMobile ? "body2" : "body1"} 
            sx={{ 
              mb: 0.5, 
              color: 'var(--text-secondary)',
              pl: 1
            }}
          >
            • {info}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default CalendarInfoBox;
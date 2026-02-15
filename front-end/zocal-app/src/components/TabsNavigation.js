import React from 'react';
import {
  Tabs,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CalendarMonth,
  Calculate,
  Event
} from '@mui/icons-material';

const TabsNavigation = ({ tabValue, handleTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      sx={{ 
        borderTop: 1, 
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        minHeight: isMobile ? 48 : 64
      }}
    >
      <Tab
        icon={<Calculate fontSize={isMobile ? "small" : "medium"} />}
        label={isMobile ? "Roj Calc" : "Roj Calculator"}
        iconPosition={isMobile ? "top" : "start"}
        sx={{ 
          minHeight: isMobile ? 48 : 64, 
          fontSize: isMobile ? '0.7rem' : '1rem',
          borderRight: 1,
          borderColor: 'divider',
          color: 'primary.main',
          py: isMobile ? 0.5 : 1,
          px: isMobile ? 0.5 : 1,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            borderBottom: 2,
            borderBottomColor: 'primary.dark',
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }
        }}
      />
      <Tab
        icon={<CalendarMonth fontSize={isMobile ? "small" : "medium"} />}
        label="Calendar"
        iconPosition={isMobile ? "top" : "start"}
        sx={{ 
          minHeight: isMobile ? 48 : 64, 
          fontSize: isMobile ? '0.7rem' : '1rem',
          borderRight: 1,
          borderColor: 'divider',
          color: 'primary.main',
          py: isMobile ? 0.5 : 1,
          px: isMobile ? 0.5 : 1,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            borderBottom: 2,
            borderBottomColor: 'primary.dark',
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }
        }}
      />
      <Tab
        icon={<Event fontSize={isMobile ? "small" : "medium"} />}
        label="Events"
        iconPosition={isMobile ? "top" : "start"}
        sx={{ 
          minHeight: isMobile ? 48 : 64, 
          fontSize: isMobile ? '0.7rem' : '1rem',
          color: 'primary.main',
          py: isMobile ? 0.5 : 1,
          px: isMobile ? 0.5 : 1,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            borderBottom: 2,
            borderBottomColor: 'primary.dark',
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }
        }}
      />
    </Tabs>
  );
};

export default TabsNavigation;
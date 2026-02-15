import React from 'react';
import {
  Tabs,
  Tab
} from '@mui/material';
import {
  CalendarMonth,
  Calculate,
  Event
} from '@mui/icons-material';

const TabsNavigation = ({ tabValue, handleTabChange }) => {
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
        backgroundColor: 'background.paper'
      }}
    >
      <Tab
        icon={<Calculate />}
        label="Roj Calculator"
        iconPosition="start"
        sx={{ 
          minHeight: 64, 
          fontSize: '1rem',
          borderRight: 1,
          borderColor: 'divider',
          color: 'primary.main',
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
        icon={<CalendarMonth />}
        label="Calendar"
        iconPosition="start"
        sx={{ 
          minHeight: 64, 
          fontSize: '1rem',
          borderRight: 1,
          borderColor: 'divider',
          color: 'primary.main',
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
        icon={<Event />}
        label="Events"
        iconPosition="start"
        sx={{ 
          minHeight: 64, 
          fontSize: '1rem',
          color: 'primary.main',
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
import React from 'react';
import {
  Tabs,
  Tab,
  Box,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CalendarMonth,
  Calculate,
  Event
} from '@mui/icons-material';
import CalendarTab from '../tabs/CalendarTab';
import RojCalculatorTab from '../tabs/RojCalculatorTab';
import EventsTab from '../tabs/EventsTab';

const TabsNavigation = ({ tabValue, handleTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Common tab styling
  const baseTabStyles = {
    minHeight: isMobile ? 48 : 64, 
    fontSize: isMobile ? '0.7rem' : '1rem',
    color: 'var(--primary-main)',
    py: isMobile ? 0.5 : 1,
    px: isMobile ? 0.5 : 1,
    '&.Mui-selected': {
      backgroundColor: 'var(--primary-main)',
      color: 'var(--color-white)',
      borderBottom: 2,
      borderBottomColor: 'var(--primary-dark)',
      '& .MuiSvgIcon-root': {
        color: 'var(--color-white)'
      }
    }
  };

  const tabWithBorderStyles = {
    ...baseTabStyles,
    borderRight: 1,
    borderColor: 'var(--divider)'
  };

  // TabPanel functionality integrated here
  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: isMobile ? 0 : 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <Box sx={{ 
        position: 'sticky', 
        top: isMobile ? 48 : 64, 
        zIndex: 1300, 
        backgroundColor: 'var(--background-paper)',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'var(--divider)'
      }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
        sx={{ 
          backgroundColor: 'var(--background-paper)',
          minHeight: isMobile ? 48 : 64
        }}
      >
      <Tab
        icon={<Calculate fontSize={isMobile ? "small" : "medium"} />}
        label={isMobile ? "Roj Calc" : "Roj Calculator"}
        iconPosition={isMobile ? "top" : "start"}
        sx={tabWithBorderStyles}
      />
      <Tab
        icon={<CalendarMonth fontSize={isMobile ? "small" : "medium"} />}
        label="Calendar"
        iconPosition={isMobile ? "top" : "start"}
        sx={tabWithBorderStyles}
      />
      <Tab
        icon={<Event fontSize={isMobile ? "small" : "medium"} />}
        label="Events"
        iconPosition={isMobile ? "top" : "start"}
        sx={baseTabStyles}
      />
      </Tabs>
    </Box>
    
    {/* Tab Content */}
    <Container 
      maxWidth={isMobile ? false : "xl"} 
      sx={{ 
        mt: isMobile ? 0.5 : 2,
        px: isMobile ? '4px' : 'inherit',
        maxWidth: isMobile ? '100%' : 'inherit'
      }}
    >
      <TabPanel value={tabValue} index={0}>
        <RojCalculatorTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CalendarTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <EventsTab />
      </TabPanel>
    </Container>
    </>
  );
};

export default TabsNavigation;
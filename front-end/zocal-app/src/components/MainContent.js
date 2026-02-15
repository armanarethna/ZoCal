import React from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import TabPanel from './TabPanel';
import CalendarTab from './CalendarTab';
import RojCalculatorTab from './RojCalculatorTab';
import EventsTab from './EventsTab';

const MainContent = ({ tabValue }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
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
  );
};

export default MainContent;
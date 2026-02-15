import React from 'react';
import { Container } from '@mui/material';
import TabPanel from './TabPanel';
import CalendarTab from './CalendarTab';
import RojCalculatorTab from './RojCalculatorTab';
import EventsTab from './EventsTab';

const MainContent = ({ tabValue }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
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
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

function TabPanel({ children, value, index, ...other }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
}

export default TabPanel;
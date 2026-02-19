import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { getMonth, getYear } from 'date-fns';
import { GREGORIAN_MONTHS, ZOROASTRIAN_CALENDAR_TYPES } from '../../constants';

const CalendarHeaderMobile = ({
  currentDate,
  calendarType,
  isCurrentMonth,
  years,
  onPrevMonth,
  onNextMonth,
  onYearChange,
  onToday,
  onCalendarTypeChange
}) => {
  return (
    <Box>
      {/* Navigation, Year, Calendar Type and Today */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={0.2}>
          <IconButton onClick={onPrevMonth} size="small" sx={{ p: 0.5 }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ minWidth: '45px', textAlign: 'center', fontSize: '1rem' }}>
            {GREGORIAN_MONTHS[getMonth(currentDate)].substring(0, 3)}
          </Typography>
          <IconButton onClick={onNextMonth} size="small" sx={{ p: 0.5 }}>
            <ChevronRight />
          </IconButton>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 70, ml: 1 }}>
            <Select
              value={getYear(currentDate)}
              onChange={onYearChange}
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 80, ml: 1 }}>
            <Select
              value={calendarType}
              onChange={onCalendarTypeChange}
              sx={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
            >
              {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          onClick={onToday}
          disabled={isCurrentMonth}
          size="small"
          sx={{
            fontSize: '0.7rem',
            fontWeight: 'bold',
            minWidth: '60px',
            py: 0.5,
            px: 1,
          }}
        >
          <Today fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarHeaderMobile;
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

const CalendarHeaderDesktop = ({
  currentDate,
  calendarType,
  isCurrentMonth,
  years,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
  onToday,
  onCalendarTypeChange
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onPrevMonth} sx={{ px: 0 }}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={onNextMonth} sx={{ px: 0 }}>
          <ChevronRight />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          <FormControl variant="standard" sx={{ mr: 1, minWidth: 120 }}>
            <Select
              value={getMonth(currentDate)}
              onChange={onMonthChange}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
              }}
            >
              {GREGORIAN_MONTHS.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 80 }}>
            <Select
              value={getYear(currentDate)}
              onChange={onYearChange}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ ml: 2, minWidth: 100 }}>
            <Select
              value={calendarType}
              onChange={onCalendarTypeChange}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
              }}
            >
              {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Today />}
        onClick={onToday}
        disabled={isCurrentMonth}
        size="medium"
        sx={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          minWidth: '120px',
          py: 1,
          px: 2.5,
          backgroundColor: 'var(--primary-main)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'var(--primary-dark)'
          },
          '&.Mui-disabled': {
            backgroundColor: 'var(--grey-400)',
            color: 'white'
          }
        }}
      >
        Today
      </Button>
    </Box>
  );
};

export default CalendarHeaderDesktop;
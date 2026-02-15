import { createSlice } from '@reduxjs/toolkit';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { calendarTypes } from '../utils/zoroastrianCalendar';
import { loginUser, registerUser, getCurrentUser, updateUserSettings, logout } from './authSlice';

const initialState = {
  currentDate: new Date(),
  selectedDate: new Date(),
  calendarDays: [],
  events: [],
  // Roj Calculator state
  rojCalculator: {
    calendarType: calendarTypes.SHENSHAI,
    selectedDate: new Date().toISOString().split('T')[0],
    beforeSunrise: false,
    result: null,
    isValidDate: true
  }
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
      state.calendarDays = generateCalendarDays(action.payload);
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    goToToday: (state) => {
      const today = new Date();
      state.currentDate = today;
      state.selectedDate = today;
      state.calendarDays = generateCalendarDays(today);
    },
    nextMonth: (state) => {
      const nextMonth = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
      state.currentDate = nextMonth;
      state.calendarDays = generateCalendarDays(nextMonth);
    },
    prevMonth: (state) => {
      const prevMonth = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
      state.currentDate = prevMonth;
      state.calendarDays = generateCalendarDays(prevMonth);
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    // Roj Calculator actions
    setRojCalendarType: (state, action) => {
      state.rojCalculator.calendarType = action.payload;
    },
    setRojSelectedDate: (state, action) => {
      state.rojCalculator.selectedDate = action.payload;
    },
    setRojBeforeSunrise: (state, action) => {
      state.rojCalculator.beforeSunrise = action.payload;
    },
    setRojResult: (state, action) => {
      state.rojCalculator.result = action.payload;
    },
    setRojIsValidDate: (state, action) => {
      state.rojCalculator.isValidDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sync calendar type when user logs in
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.data.user?.default_zoro_cal) {
          state.rojCalculator.calendarType = action.payload.data.user.default_zoro_cal;
        }
      })
      // Sync calendar type when user registers
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload.data.user?.default_zoro_cal) {
          state.rojCalculator.calendarType = action.payload.data.user.default_zoro_cal;
        }
      })
      // Sync calendar type when getting current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload.data?.default_zoro_cal) {
          state.rojCalculator.calendarType = action.payload.data.default_zoro_cal;
        }
      })
      // Sync calendar type when user settings are updated
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        if (action.payload.data?.default_zoro_cal) {
          state.rojCalculator.calendarType = action.payload.data.default_zoro_cal;
        }
      })
      // Revert to default when user logs out
      .addCase(logout, (state) => {
        state.rojCalculator.calendarType = calendarTypes.SHENSHAI;
      });
  },
});

// Helper function to generate calendar days
function generateCalendarDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: startDate, end: endDate }).map(day => ({
    date: day,
    isCurrentMonth: isSameMonth(day, date),
    isToday: isToday(day),
  }));
}



export const { 
  setCurrentDate, 
  setSelectedDate, 
  goToToday, 
  nextMonth, 
  prevMonth, 
  addEvent, 
  removeEvent,
  setRojCalendarType,
  setRojSelectedDate,
  setRojBeforeSunrise,
  setRojResult,
  setRojIsValidDate
} = calendarSlice.actions;

export default calendarSlice.reducer;
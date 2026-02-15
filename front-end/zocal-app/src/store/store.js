import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import calendarReducer from './calendarSlice';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    calendar: calendarReducer,
    auth: authReducer,
    events: eventsReducer,
  },
});

export default store;
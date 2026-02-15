import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser, updateUserSettings, logout } from './authSlice';

const getInitialDarkMode = () => {
  const stored = localStorage.getItem('darkMode');
  return stored ? JSON.parse(stored) : false;
};

const initialState = {
  darkMode: getInitialDarkMode(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    syncThemeWithUser: (state, action) => {
      // Sync theme with user's display_mode preference when authenticated
      if (action.payload?.display_mode) {
        state.darkMode = action.payload.display_mode === 'dark';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sync theme when user logs in
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.data.user?.display_mode) {
          state.darkMode = action.payload.data.user.display_mode === 'dark';
        }
      })
      // Sync theme when user registers
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload.data.user?.display_mode) {
          state.darkMode = action.payload.data.user.display_mode === 'dark';
        }
      })
      // Sync theme when getting current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload.data?.display_mode) {
          state.darkMode = action.payload.data.display_mode === 'dark';
        }
      })
      // Sync theme when user settings are updated
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        if (action.payload.data?.display_mode) {
          state.darkMode = action.payload.data.display_mode === 'dark';
        }
      })
      // Revert to localStorage preference when user logs out
      .addCase(logout, (state) => {
        state.darkMode = getInitialDarkMode();
      });
  },
});

export const { toggleTheme, setDarkMode, syncThemeWithUser } = themeSlice.actions;

export default themeSlice.reducer;
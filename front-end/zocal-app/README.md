# ZoCal - Your Personal Zoroastrian Calendar

## Overview
A React application for managing and viewing Zoroastrian calendar dates, with three main features:

- **Calendar Tab**: Monthly calendar view showing both Gregorian and Zoroastrian dates (Shenshai system)
- **Roj Calculator Tab**: Date conversion tools (Coming Soon)
- **Events Tab**: Personal event management (Coming Soon)

## Features
- 📅 Monthly calendar view with Zoroastrian date integration
- 🌓 Dark/Light mode toggle
- 📱 Responsive design for web and mobile
- ⚡ Material-UI components for modern styling
- 🔄 Redux state management
- 📍 Today button for quick navigation
- 🎨 Google Calendar-inspired design

## Tech Stack
- **Frontend**: React 18 + JavaScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Date Handling**: date-fns
- **Styling**: Material-UI components + CSS

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Navigate to the project directory:
   ```bash
   cd "C:\Users\Arman\Desktop\ZoCal\front-end\zocal-app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure
```
zocal-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── CalendarTab.js       # Main calendar component
│   │   ├── RojCalculatorTab.js  # Date calculator (placeholder)
│   │   └── EventsTab.js         # Events management (placeholder)
│   ├── store/
│   │   ├── store.js            # Redux store configuration
│   │   ├── themeSlice.js       # Theme state management
│   │   └── calendarSlice.js    # Calendar state management
│   ├── theme/
│   │   └── theme.js           # Material-UI theme configuration
│   ├── App.js                 # Main application component
│   ├── index.js              # Application entry point
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## Current Status

### ✅ Completed Features
- [x] Project setup with React + Material-UI + Redux
- [x] Tab navigation (Calendar, Roj Calculator, Events)
- [x] Dark/Light theme toggle
- [x] Calendar component with monthly view
- [x] Zoroastrian date display boxes (placeholder data)
- [x] Today button and month navigation
- [x] Responsive layout

### 🔄 Next Steps
1. **Implement Zoroastrian Calendar Logic**
   - Replace placeholder data with actual Shenshai calendar calculations
   - Add proper date conversion algorithms
   - Include holy days and festivals

2. **Roj Calculator Tab**
   - Date picker for Gregorian to Zoroastrian conversion
   - Reverse conversion (Zoroastrian to Gregorian)
   - Religious significance information

3. **Events Tab**
   - Personal event creation and management
   - Event categories (personal, religious, community)
   - Local storage for event persistence

4. **Enhancements**
   - Better mobile responsiveness
   - Accessibility improvements
   - Performance optimizations

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (⚠️ one-way operation)

## Calendar Features

### Current Calendar Implementation
- Monthly grid view with previous/next navigation
- Current month highlighting
- Today indicator with special styling
- Zoroastrian date boxes within each day
- Holy day indicators (sample)
- Click-to-select date functionality

### Zoroastrian Calendar Integration
Currently using placeholder data. Next implementation phase will include:
- Proper Shenshai calendar system conversion
- Roj (day names) and Mah (month names)
- Religious observances and festivals
- Gahambars and other important dates

## Theme Customization
The app supports both light and dark themes inspired by Google Calendar:
- **Light Theme**: Clean white backgrounds with blue accents
- **Dark Theme**: Dark backgrounds with blue highlights
- **Responsive**: Automatic adaptation to user preferences

## Contributing
This is a personal project for Zoroastrian calendar management. Future enhancements will focus on:
1. Accurate calendar calculations
2. Religious observance integration
3. Community features
4. Multi-language support

---

*Built with ❤️ for the Zoroastrian community*
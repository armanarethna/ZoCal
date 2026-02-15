# ZoCal - Zoroastrian Calendar Application

A full-stack calendar application for the Zoroastrian community featuring event management and Roj calculations.

## 🏗️ Architecture

- **Frontend**: React.js with Material-UI and Redux Toolkit
- **Backend**: Node.js with Express.js and MongoDB
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ZoCal.git
   cd ZoCal
   ```

2. **Backend Setup**
   ```bash
   cd back-end
   npm install
   cp .env.template .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd front-end/zocal-app
   npm install
   npm start
   ```

## 📁 Project Structure

```
ZoCal/
├── back-end/          # Express.js API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # Express routes
│   └── utils/         # Utility functions
└── front-end/zocal-app/ # React application
    ├── public/        # Static files
    ├── src/
    │   ├── components/  # React components
    │   ├── store/      # Redux store
    │   ├── styles/     # CSS styles
    │   ├── theme/      # MUI theme
    │   └── utils/      # Utility functions
```

## 🌍 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=your_frontend_url
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_api_url
```

## 🚀 Production Deployment

### Deploy Backend to Heroku

1. **Prepare backend for deployment**
   ```bash
   cd back-end
   # Ensure package.json has correct start script
   ```

2. **Create and deploy to Heroku**
   ```bash
   heroku create zocal-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=your_frontend_url
   git subtree push --prefix=back-end heroku main
   ```

### Deploy Frontend to Vercel/Netlify

1. **Build and deploy frontend**
   - Push to GitHub
   - Connect your repository to Vercel or Netlify
   - Set environment variable: `REACT_APP_API_URL=your_heroku_backend_url`
   - Deploy automatically

## 🧪 API Testing

See [API_TESTING_GUIDE.md](back-end/API_TESTING_GUIDE.md) for detailed API documentation and testing instructions.

## 📄 License

ISC License
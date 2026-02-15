#!/bin/bash
# Heroku Backend Deployment Script

echo "🚀 Deploying ZoCal Backend to Heroku..."

# Create Heroku app (run once)
echo "Creating Heroku app..."
heroku create zocal-backend-app

# Set environment variables
echo "Setting environment variables..."
heroku config:set NODE_ENV=production --app zocal-backend-app
heroku config:set JWT_SECRET="your-super-strong-jwt-secret" --app zocal-backend-app
heroku config:set CLIENT_URL="https://your-frontend-url.vercel.app" --app zocal-backend-app
heroku config:set EMAIL_SERVICE="gmail" --app zocal-backend-app
heroku config:set EMAIL_USER="your-email@gmail.com" --app zocal-backend-app
heroku config:set EMAIL_PASS="your-app-password" --app zocal-backend-app

# You'll need to set this manually with your actual MongoDB URI
echo "⚠️  Don't forget to set MONGODB_URI:"
echo "heroku config:set MONGODB_URI='your-mongodb-connection-string' --app zocal-backend-app"

# Deploy backend
echo "Deploying backend..."
git subtree push --prefix=back-end heroku main

echo "✅ Backend deployment complete!"
echo "📝 Your backend URL: https://zocal-backend-app.herokuapp.com"
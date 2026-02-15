# PowerShell Deployment Script for Windows

Write-Host "🚀 Deploying ZoCal Backend to Heroku..." -ForegroundColor Green

# Create Heroku app (run once)
Write-Host "Creating Heroku app..." -ForegroundColor Yellow
heroku create zocal-backend-app

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
heroku config:set NODE_ENV=production --app zocal-backend-app
heroku config:set JWT_SECRET="your-super-strong-jwt-secret" --app zocal-backend-app
heroku config:set CLIENT_URL="https://your-frontend-url.vercel.app" --app zocal-backend-app
heroku config:set EMAIL_SERVICE="gmail" --app zocal-backend-app
heroku config:set EMAIL_USER="your-email@gmail.com" --app zocal-backend-app
heroku config:set EMAIL_PASS="your-app-password" --app zocal-backend-app

# MongoDB URI needs to be set manually
Write-Host "⚠️  Don't forget to set MONGODB_URI:" -ForegroundColor Red
Write-Host "heroku config:set MONGODB_URI='your-mongodb-connection-string' --app zocal-backend-app" -ForegroundColor Cyan

# Deploy backend
Write-Host "Deploying backend..." -ForegroundColor Yellow
git subtree push --prefix=back-end heroku main

Write-Host "✅ Backend deployment complete!" -ForegroundColor Green
Write-Host "📝 Your backend URL: https://zocal-backend-app.herokuapp.com" -ForegroundColor Cyan
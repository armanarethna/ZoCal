# 🚀 ZoCal Production Deployment Guide

## Prerequisites

1. **GitHub Account** - for hosting your code
2. **MongoDB Atlas** - for production database
3. **Heroku Account** - for backend hosting (free tier available)  
4. **Vercel/Netlify Account** - for frontend hosting (free tier available)

## Step-by-Step Deployment Process

### Phase 1: GitHub Setup (✅ COMPLETE)

Your code is already committed to Git. Now:

1. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `ZoCal`  
   - Keep it public or private (your choice)
   - Don't initialize with README

2. **Push to GitHub:**
   ```bash
   # Replace YOUR_USERNAME with your actual GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/ZoCal.git
   git push -u origin main
   ```

### Phase 2: Database Setup

1. **Create MongoDB Atlas Cluster:**
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Setup database user and whitelist IP addresses
   - Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/zocal`)

### Phase 3: Backend Deployment (Heroku)

1. **Install Heroku CLI:**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli
   - Login: `heroku login`

2. **Deploy Backend:**
   ```bash
   # Navigate to your project root
   cd C:\Users\Arman\Desktop\ZoCal
   
   # Create Heroku app
   heroku create your-app-name-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET="your-super-strong-jwt-secret-here"
   heroku config:set MONGODB_URI="mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE"
   heroku config:set CLIENT_URL="https://your-frontend-app.vercel.app"
   
   # Deploy backend only
   git subtree push --prefix=back-end heroku main
   ```

3. **Your backend will be available at:** `https://your-app-name-backend.herokuapp.com`

### Phase 4: Frontend Deployment (Vercel - Recommended)

1. **Option A: Vercel Dashboard (Easiest)**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory to: `front-end/zocal-app`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api`
   - Deploy!

2. **Option B: Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Navigate to frontend
   cd front-end/zocal-app
   
   # Deploy
   vercel --prod
   ```

### Phase 5: Frontend Deployment (Netlify Alternative)

1. **Netlify Dashboard:**
   - Go to https://netlify.com
   - Drag and drop your `front-end/zocal-app/build` folder
   - Or connect your GitHub repository
   - Set publish directory: `front-end/zocal-app/build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api`

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zocal
JWT_SECRET=your-super-strong-jwt-secret
CLIENT_URL=https://zocal.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
```

## Deployment Alternative Options

### Backend Alternatives:
- **Railway** (similar to Heroku)
- **Render** (free tier available)
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**  

### Frontend Alternatives:
- **Netlify** (great for static sites)
- **Firebase Hosting**  
- **GitHub Pages** (for static sites)
- **AWS S3 + CloudFront**

## Post-Deployment Checklist

- [ ] Backend is accessible at Heroku URL
- [ ] Frontend is accessible at Vercel/Netlify URL  
- [ ] Database connection is working
- [ ] User registration/login works
- [ ] API endpoints respond correctly
- [ ] CORS is properly configured
- [ ] Environment variables are set

## Troubleshooting

### Common Backend Issues:
1. **App crashes:** Check Heroku logs with `heroku logs --tail`
2. **Database connection:** Verify MONGODB_URI is correct
3. **CORS errors:** Ensure CLIENT_URL matches your frontend URL

### Common Frontend Issues:  
1. **API calls fail:** Check REACT_APP_API_URL is correct
2. **Build fails:** Run `npm run build` locally first
3. **Environment variables:** Ensure they start with `REACT_APP_`

## Security Notes

- Never commit `.env` files to Git
- Use strong, unique JWT secrets  
- Whitelist specific domains in CORS
- Use HTTPS in production
- Regularly update dependencies

## Cost Estimation

- **MongoDB Atlas:** Free tier (512MB)
- **Heroku:** Free tier available (sleeps after 30min inactivity)
- **Vercel:** Free tier (generous limits)
- **Total:** $0/month for small applications

---

🎉 **Congratulations!** Your ZoCal app should now be live in production!
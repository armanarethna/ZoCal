# ZoCal Backend API

A robust Node.js backend API built with Express, MongoDB, and Mongoose for the ZoCal application.

## 🏗️ Project Structure

```
back-end/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Route controllers
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User model schema
├── routes/
│   └── auth.js              # Authentication routes
├── utils/
│   └── helpers.js           # Utility functions
├── .env.template            # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
└── server.js                # Main server file
```

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd back-end
npm install
```

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   copy .env.template .env
   ```

2. Fill in your MongoDB connection details in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 🗄️ MongoDB Atlas Setup Instructions

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In" if you have an account
3. Create a new account or sign in with existing credentials

### Step 2: Create a New Cluster

1. After logging in, click "Create a New Cluster" or "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your cloud provider and region (choose closest to your location)
4. Give your cluster a name (e.g., "ZoCal-Cluster")
5. Click "Create Cluster" (this may take 3-5 minutes)

### Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter:
   - **Username**: `zocal-admin` (or your preferred username)
   - **Password**: Generate a secure password (save this!)
5. Under "Database User Privileges", select "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, click "Add Current IP Address"
4. For production, add your server's IP address
5. For testing purposes only, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   ⚠️ **Warning**: This is not secure for production!

### Step 5: Get Your Connection String

1. Go back to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string, it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

1. Replace `<username>` with your database username
2. Replace `<password>` with your database password
3. Add your database name after `.net/` (e.g., `zocal-db`)

**Example:**
```env
MONGODB_URI=mongodb+srv://zocal-admin:mySecurePassword123@zocal-cluster.abc123.mongodb.net/zocal-db?retryWrites=true&w=majority
```

## 📋 Required Information Template

Before setting up your backend, gather these details:

### 🔐 Security Configuration
- [ ] **JWT Secret Key**: Generate a strong random string (32+ characters)
  - 🔗 Generate one here: https://generate-secret.vercel.app/32
- [ ] **Admin Email**: Your admin email address
- [ ] **Admin Password**: Strong password for admin account

### 🗄️ Database Information
- [ ] **MongoDB Username**: Database user username
- [ ] **MongoDB Password**: Database user password  
- [ ] **Cluster Name**: MongoDB Atlas cluster name
- [ ] **Database Name**: Your application database name (e.g., "zocal-db")

### 🌐 Application Configuration
- [ ] **Port**: Server port (default: 5000)
- [ ] **Frontend URL**: Your frontend application URL (for CORS)
- [ ] **Environment**: development/production

### 📧 Email Configuration (Optional)
- [ ] **SMTP Host**: Email service provider
- [ ] **SMTP Port**: Email service port
- [ ] **SMTP Username**: Email username
- [ ] **SMTP Password**: Email password

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Example API Usage

#### Register a new user
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "SecurePass123"
}
```

#### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with JSON Web Tokens
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Cross-origin resource sharing control

## 🔧 Development Tools

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Adding New Routes

1. Create a new route file in `routes/` directory
2. Import and use in `server.js`:
   ```javascript
   app.use('/api/your-route', require('./routes/your-route'));
   ```

### Adding New Models

1. Create new model in `models/` directory
2. Follow the pattern established in `User.js`
3. Include proper validation and middleware

## 🚦 Testing Your Setup

1. Start your server: `npm run dev`
2. Test the health check: `GET http://localhost:5000/`
3. Expected response:
   ```json
   {
     "message": "ZoCal Backend API is running!",
     "status": "success",
     "timestamp": "2024-01-15T10:30:00.000Z"
   }
   ```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string in `.env`
   - Verify network access settings in MongoDB Atlas
   - Ensure your IP is whitelisted

2. **JWT Secret Error**
   - Make sure `JWT_SECRET` is set in `.env`
   - Secret should be at least 32 characters long

3. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Kill any processes using the port

### Logs

Check the console for detailed error messages:
```bash
npm run dev
```

## 📝 Next Steps

1. **Customize User Model**: Modify `models/User.js` for your specific needs
2. **Add New Features**: Create additional routes and models
3. **Set up Email**: Configure email service for password reset, etc.
4. **Add File Upload**: Implement file upload functionality if needed
5. **Database Seeding**: Create initial data for your application
6. **API Documentation**: Consider using Swagger/OpenAPI for documentation

## 🔗 Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [JWT.io](https://jwt.io/) - JWT Debugger
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

---

## 📄 License

This project is licensed under the ISC License.

---

**Need help?** Check the documentation links above or create an issue in your project repository.
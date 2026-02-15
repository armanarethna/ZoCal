# ZoCal Backend API Testing Guide

## Base URL
`http://localhost:5000`

---

## Authentication Routes

### 1. Register New User
- **RequestType:** POST
- **Endpoint:** '/api/auth/register'
- **Authentication:** No
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```

### 2. Login User
- **RequestType:** POST
- **Endpoint:** '/api/auth/login'
- **Authentication:** No
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```

### 3. Get Current User
- **RequestType:** GET
- **Endpoint:** '/api/auth/me'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body:** None

### 4. Update User Profile
- **RequestType:** PUT
- **Endpoint:** '/api/auth/profile'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "John Smith",
    "phone": "+1234567890"
  }
  ```

---

## Event Routes

### 1. Create New Event
- **RequestType:** POST
- **Endpoint:** '/api/events'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "John's Birthday",
    "category": "Birthday",
    "eventDate": "1990-03-15T00:00:00.000Z",
    "beforeSunrise": false
  }
  ```

### 2. Get All Events
- **RequestType:** GET
- **Endpoint:** '/api/events'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body:** None

### 3. Get Single Event
- **RequestType:** GET
- **Endpoint:** '/api/events/:id'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body:** None

### 4. Update Event
- **RequestType:** PUT
- **Endpoint:** '/api/events/:id'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "Updated Event Name",
    "category": "Anniversary",
    "eventDate": "2024-06-20T00:00:00.000Z",
    "beforeSunrise": true
  }
  ```

### 5. Delete Event
- **RequestType:** DELETE
- **Endpoint:** '/api/events/:id'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body:** None

### 6. Search Events by Name
- **RequestType:** GET
- **Endpoint:** '/api/events/search/:term'
- **Authentication:** Yes
- **Headers:** 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body:** None
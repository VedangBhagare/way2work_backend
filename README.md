# Way2Work – Backend

Way2Work is a smart travel day planner designed to optimize commuting for professionals. This repository contains the backend services, built with Node.js, Express, and MongoDB, that power the Way2Work mobile application.

---

## 🚀 Features
- **User Authentication**:  
  - JWT-based login & registration  
  - Google OAuth integration

- **User Profile Management**:  
  - Create, update, and delete user profiles  
  - Manage preferences and settings
    
- **Task Management**:  
  - Add, edit, delete daily commute tasks  
  - Track upcoming due tasks

- **Route Planning**:  
  - Fetch real-time traffic data 
  - Suggest optimal travel routes
    
- **Real-time Notifications**:  
  - Location-based job alerts  
  - Smart refresh to avoid duplicate notifications  

---

## 🛠️ Tech Stack
Backend Framework: Node.js with Express
Database: MongoDB
Authentication: JWT, Google OAuth
APIs: Google Maps API, Google Calendar API
Authentication: JWT & Google OAuth 
Deployment: Heroku
Other Tools:  
  - bcrypt (password hashing)  
  - dotenv (environment management)  
  - nodemon (development)

## 📂 Project Structure
backend/
.
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleWare/       # Middleware functions
├── models/           # Mongoose models
├── routes/           # API routes
├── utils/            # Utility functions
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Project metadata and dependencies
└── server.js         # Entry point of the application


## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/VedangBhagare/way2work_backend.git
cd way2work_backend

### 2. Install dependencies

npm install

### 3. Configure environment

From .env file

### 4. Run development server

npm run dev

### 5. Run Production

npm start

### Contact
Email: vedang.24.bhagare@gmail.com




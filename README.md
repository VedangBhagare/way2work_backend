# way2work_backend

# Way2Work – Backend

Way2Work is a smart travel day planner designed for commuters and workers.  
This repository contains the **backend services**, built with Node.js, Express, and MongoDB, that power the Way2Work mobile application.

---

## 🚀 Features
- **User Authentication**:  
  - JWT-based login & registration  
  - Google OAuth integration  
- **Task Management**:  
  - Add, edit, delete daily commute tasks  
  - Track upcoming due tasks  
- **Real-time Notifications**:  
  - Location-based job alerts  
  - Smart refresh to avoid duplicate notifications  

---

## 🛠️ Tech Stack
- **Runtime**: Node.js (Express.js)  
- **Database**: MongoDB (Mongoose ORM)  
- **Authentication**: JWT & Google OAuth  
- **Deployment**: (Heroku / Render / AWS / Railway – update based on what you used)  
- **Other Tools**:  
  - bcrypt (password hashing)  
  - dotenv (environment management)  
  - nodemon (development)

---

## 📂 Project Structure
backend/
│── src/
│ ├── config/ # DB connection, environment configs
│ ├── controllers/ # Business logic (auth, tasks, jobs)
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # JWT, error handling
│ └── index.js # Server entry point
│── .env.example
|── server.js
│── package.json
│── README.md

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone [https://github.com/VedangBhagare/way2work_backend.git]
cd way2work-backend
```
### 2. Install dependencies

npm install

### 3. Configure environment

### 4. Run development server

npm run dev

### 5. Run Production

npm start




# MERN To-Do App

A full-stack to-do list application built with MongoDB, Express.js, React, and Node.js. Features user authentication, task CRUD, sorting/filtering, and real-time updates.

## Project Structure

```
To-Do/
  backend/
    controllers/
    middleware/
    models/
    routes/
    server.js
    package.json
    .env
  frontend/
    src/
      components/
      pages/
      api.js
      App.js
      index.js
    package.json
    .env
```

## Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (running locally or provide a connection string)

## Setup Instructions

### 1. Clone the repository and navigate to the project folder
```
cd To-Do
```

### 2. Backend Setup
```
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
MONGO_URI=mongodb://localhost:27017/todo
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```
npm run dev
```

### 3. Frontend Setup
Open a new terminal and run:
```
cd To-Do/frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:
```
npm start
```

### 4. Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Register a new user, log in, and start managing your tasks!
- Tasks are synced in real-time across clients.

## Features
- User registration and login (JWT authentication)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Organize tasks by priority and due date
- Real-time updates using Socket.IO

## Notes
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env` for a remote database.
- For production, use secure values for secrets and environment variables.

---

Enjoy your MERN To-Do App! 
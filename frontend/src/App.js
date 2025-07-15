import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import Profile from './pages/Profile';
import API from './api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div>
        <header>
          <h1>To-Do App</h1>
          {user && (
            <>
              <Link to="/tasks" style={{ marginRight: '1em', color: '#00ffe7', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
              <Link to="/profile" style={{ marginRight: '1em', color: '#00ffe7', textDecoration: 'none', fontWeight: 600 }}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </header>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/tasks" element={user ? <TaskList user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/tasks" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App; 
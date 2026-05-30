import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import TaskFormPage from './pages/TaskFormPage.jsx';
import TaskDetailsPage from './pages/TaskDetailsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';

function PrivateRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleAuth(token, nextUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
    navigate('/');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Task Manager LB2</h1>
          <p>Node.js + Express + React. Реалізація до 3 рівня.</p>
        </div>

        {user && (
          <div className="user-panel">
            <span>{user.name}</span>
            <strong>{user.role}</strong>
            <button onClick={logout}>Вийти</button>
          </div>
        )}
      </header>

      {user && (
        <nav className="navigation">
          <Link to="/">Задачі</Link>
          <Link to="/add">Додати задачу</Link>
          <Link to="/reminders">Нагадування</Link>
          <Link to="/analytics">Аналітика</Link>
        </nav>
      )}

      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
          <Route path="/" element={<PrivateRoute user={user}><TasksPage user={user} /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute user={user}><TaskFormPage user={user} /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute user={user}><TaskFormPage user={user} /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute user={user}><TaskDetailsPage /></PrivateRoute>} />
          <Route path="/reminders" element={<PrivateRoute user={user}><RemindersPage /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute user={user}><AnalyticsPage /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

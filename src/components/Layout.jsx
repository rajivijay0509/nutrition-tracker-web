import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Food Logging', icon: '🍽️', path: '/food-logging' },
    { label: 'Wellness', icon: '💪', path: '/wellness' },
    { label: 'Recipes', icon: '👨‍🍳', path: '/recipes' },
    { label: 'History', icon: '📈', path: '/history' },
    { label: 'Profile', icon: '👤', path: '/profile' },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-emoji">🥗</span>
            <span className="logo-text">NutriTrack</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary btn-block" onClick={handleLogout}>
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle sidebar"
            >
              ☰
            </button>
            <h2>NutriTrack</h2>
          </div>

          <div className="top-bar-right">
            <div className="user-info">
              <span className="user-name">{user?.firstName || 'User'}</span>
              <div className="user-avatar">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'D', path: '/' },
    { label: 'Food Log', icon: 'F', path: '/food-logging' },
    { label: 'Wellness', icon: 'W', path: '/wellness' },
    { label: 'Recipes', icon: 'R', path: '/recipes' },
    { label: 'Community', icon: 'C', path: '/community' },
    { label: 'History', icon: 'H', path: '/history' },
    { label: 'Goals', icon: 'G', path: '/goals' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="layout-horizontal">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-brand" onClick={() => navigate('/')}>
            <span className="brand-icon">N</span>
            <span className="brand-text">NutriTrack</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-menu desktop-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className="nav-link-icon">{item.icon}</span>
                <span className="nav-link-text">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Profile Dropdown */}
            <div className="profile-section">
              <button
                className="profile-btn"
                onClick={() => navigate('/profile')}
              >
                <div className="profile-avatar">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="profile-name">{user?.firstName || 'User'}</span>
              </button>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                Exit
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-menu mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
            </button>
          ))}
          <button className="nav-link logout-mobile" onClick={handleLogout}>
            <span className="nav-link-icon">X</span>
            <span className="nav-link-text">Logout</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content-horizontal">
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>NutriTrack - Your Nutrition Companion</p>
      </footer>
    </div>
  );
};

export default Layout;

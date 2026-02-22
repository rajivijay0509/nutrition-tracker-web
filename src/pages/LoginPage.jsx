import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };

  const handleOAuth = (provider) => {
    loginWithOAuth(provider);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🥗</div>
          <h1>NutriTrack</h1>
          <p>Your Personal Nutrition Companion</p>
        </div>

        <div className="auth-content">
          <div className="auth-tabs">
            <button className="auth-tab active">Login</button>
          </div>

          {(error || localError) && (
            <div className="alert alert-danger">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="oauth-buttons">
            <button 
              className="oauth-btn google"
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
            >
              <span>🔵</span> Google
            </button>
            <button 
              className="oauth-btn apple"
              onClick={() => handleOAuth('apple')}
              disabled={isLoading}
            >
              <span>🍎</span> Apple
            </button>
            <button 
              className="oauth-btn facebook"
              onClick={() => handleOAuth('facebook')}
              disabled={isLoading}
            >
              <span>📘</span> Facebook
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </div>
        </div>
      </div>

      <div className="auth-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>
    </div>
  );
};

export default LoginPage;

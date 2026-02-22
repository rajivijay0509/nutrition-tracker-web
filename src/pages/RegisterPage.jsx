import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    heightCm: '',
    gender: '',
    agreeToTerms: false,
  });
  const [localError, setLocalError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setLocalError('');
    clearError();
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setLocalError('Please enter your name');
      return false;
    }
    if (!formData.email) {
      setLocalError('Please enter your email');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setLocalError('Please enter a password');
      return false;
    }
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.heightCm) {
      setLocalError('Please enter your height');
      return false;
    }
    if (!formData.gender) {
      setLocalError('Please select your gender');
      return false;
    }
    if (!formData.agreeToTerms) {
      setLocalError('Please agree to terms and privacy policy');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setLocalError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateStep3()) return;

    const success = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🥗</div>
          <h1>NutriTrack</h1>
          <p>Join our nutrition community</p>
        </div>

        <div className="auth-content">
          <div className="auth-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>

          {(error || localError) && (
            <div className="alert alert-danger">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <h3>Create Password</h3>
                <p className="form-hint">
                  Must be 8+ characters, include uppercase, number, and special character
                </p>
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <>
                <h3>Health Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="heightCm">Height (cm) *</label>
                    <input
                      id="heightCm"
                      type="number"
                      name="heightCm"
                      value={formData.heightCm}
                      onChange={handleChange}
                      placeholder="170"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group checkbox">
                  <input
                    id="terms"
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="terms">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </>
            )}

            <div className="auth-buttons">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
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

export default RegisterPage;

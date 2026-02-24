import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import '../styles/Profile.css';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const { profile, updateProfile, getProfile, isLoading, error } = useProfileStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    height: '',
    gender: '',
    targetCalories: 850,
    targetSleep: 8,
    targetExercise: 30,
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || user?.firstName || '',
        lastName: profile.lastName || user?.lastName || '',
        bio: profile.bio || '',
        height: profile.height || '',
        gender: profile.gender || user?.gender || '',
        targetCalories: profile.targetCalories || 850,
        targetSleep: profile.targetSleep || 8,
        targetExercise: profile.targetExercise || 30,
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleUpdateProfile = async () => {
    if (!formData.firstName || !formData.lastName) {
      setLocalError('Name is required');
      return;
    }

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!password.current || !password.new || !password.confirm) {
      setLocalError('All password fields are required');
      return;
    }

    if (password.new !== password.confirm) {
      setLocalError('New passwords do not match');
      return;
    }

    if (password.new.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      setSuccess('Password changed successfully!');
      setPassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to change password');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleExportData = () => {
    alert('Data export feature coming soon');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone. Type DELETE to confirm.')) {
      const confirmText = prompt('Type DELETE to confirm account deletion:');
      if (confirmText === 'DELETE') {
        alert('Account deletion feature coming soon');
      }
    }
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {localError && <div className="alert alert-danger">{localError}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="card profile-card">
              <div className="profile-header">
                <div className="avatar">
                  <span>{user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                </div>
                <div className="profile-info">
                  <h2>{formData.firstName || user?.user_metadata?.first_name || 'User'} {formData.lastName || user?.user_metadata?.last_name || ''}</h2>
                  <p className="email">{user?.email}</p>
                  <p className="member-since">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              {!editMode ? (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="label">Height</span>
                    <span className="value">{formData.height || 'Not set'} cm</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gender</span>
                    <span className="value">{formData.gender || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Bio</span>
                    <span className="value">{formData.bio || 'Add a bio to personalize your profile'}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="profile-edit">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g., 175"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      className="input-field"
                      rows="4"
                    />
                  </div>

                  <div className="button-group">
                    <button
                      className="btn btn-primary"
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="card">
              <h3>Daily Goals</h3>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Daily Calorie Target</strong>
                    <p>Set your daily calorie goal</p>
                  </div>
                  <div className="setting-control">
                    <input
                      type="number"
                      name="targetCalories"
                      value={formData.targetCalories}
                      onChange={handleInputChange}
                      className="input-field small"
                    />
                    <span>kcal</span>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Sleep Target</strong>
                    <p>Recommended hours of sleep</p>
                  </div>
                  <div className="setting-control">
                    <input
                      type="number"
                      name="targetSleep"
                      value={formData.targetSleep}
                      onChange={handleInputChange}
                      step="0.5"
                      className="input-field small"
                    />
                    <span>hours</span>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Exercise Target</strong>
                    <p>Daily exercise duration</p>
                  </div>
                  <div className="setting-control">
                    <input
                      type="number"
                      name="targetExercise"
                      value={formData.targetExercise}
                      onChange={handleInputChange}
                      className="input-field small"
                    />
                    <span>minutes</span>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: '32px' }}>Notification Preferences</h3>
              <div className="settings-group">
                <label className="checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for goals</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Reminder for meal logging</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Wellness check-in reminders</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>New recipe notifications</span>
                </label>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleUpdateProfile}
                style={{ marginTop: '24px' }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="tab-content">
            <div className="card">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 8 characters)"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="input-field"
                />
              </div>

              <button className="btn btn-primary" onClick={handleChangePassword}>
                Change Password
              </button>

              <h3 style={{ marginTop: '40px' }}>Two-Factor Authentication</h3>
              <p className="info-text">Add an extra layer of security to your account</p>
              <button className="btn btn-secondary" disabled>
                Enable 2FA (Coming Soon)
              </button>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="tab-content">
            <div className="card">
              <h3>Data Management</h3>
              <div className="account-item">
                <div>
                  <strong>Export Your Data</strong>
                  <p>Download all your personal data in JSON format</p>
                </div>
                <button className="btn btn-secondary" onClick={handleExportData}>
                  Export Data
                </button>
              </div>

              <h3 style={{ marginTop: '40px' }}>Account Actions</h3>
              <div className="account-item danger">
                <div>
                  <strong>Logout</strong>
                  <p>Sign out from your account on this device</p>
                </div>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </div>

              <div className="account-item danger">
                <div>
                  <strong>Delete Account</strong>
                  <p>Permanently delete your account and all associated data</p>
                </div>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>

              <h3 style={{ marginTop: '40px' }}>Account Information</h3>
              <div className="info-box">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Account Created:</strong> {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                <p><strong>Last Login:</strong> Today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

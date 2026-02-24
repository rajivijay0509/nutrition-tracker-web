import React, { useState, useEffect } from 'react';
import { useGoalStore } from '../store/goalStore';
import '../styles/Goals.css';

const GoalsPage = () => {
  const { goals, getGoals, addGoal, updateGoal, isLoading, error } = useGoalStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    goalType: 'calories',
    targetValue: 850,
    category: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    name: '',
    description: '',
  });

  const goalTypes = [
    { value: 'calories', label: 'Daily Calories', unit: 'kcal' },
    { value: 'sleep', label: 'Sleep', unit: 'hours' },
    { value: 'exercise', label: 'Exercise', unit: 'minutes' },
    { value: 'water', label: 'Water', unit: 'glasses' },
    { value: 'steps', label: 'Steps', unit: 'steps' },
    { value: 'weight', label: 'Weight', unit: 'kg' },
  ];

  useEffect(() => {
    getGoals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleAddGoal = async () => {
    if (!formData.targetValue || !formData.name) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      const newGoal = {
        ...formData,
        targetValue: parseFloat(formData.targetValue),
        currentValue: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await addGoal(newGoal);
      setSuccess('Goal added successfully!');
      setFormData({
        goalType: 'calories',
        targetValue: 850,
        category: 'daily',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        name: '',
        description: '',
      });
      setShowAddForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to add goal');
    }
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const isGoalAchieved = (goal) => {
    return goal.currentValue >= goal.targetValue;
  };

  const getGoalIcon = (goalType) => {
    const icons = {
      calories: 'C',
      sleep: 'S',
      exercise: 'E',
      water: 'W',
      steps: 'St',
      weight: 'Wt',
    };
    return icons[goalType] || 'G';
  };

  const getGoalLabel = (goalType) => {
    const goal = goalTypes.find(g => g.value === goalType);
    return goal ? goal.label : goalType;
  };

  // Calculate statistics
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => isGoalAchieved(g));
  const averageProgress = activeGoals.length > 0
    ? Math.round((activeGoals.reduce((sum, g) => sum + getProgressPercentage(g), 0)) / activeGoals.length)
    : 0;

  return (
    <div className="goals-container">
      {/* Header */}
      <div className="page-header">
        <h1>Goals & Achievements</h1>
        <p>Set and track your health and wellness goals</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {localError && <div className="alert alert-danger">{localError}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="goals-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          My Goals
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
        <button
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {/* Content */}
      <div className="goals-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Active Goals</span>
                <span className="stat-value">{activeGoals.length}</span>
                <p className="stat-detail">Currently tracking</p>
              </div>

              <div className="stat-card">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{completedGoals.length}</span>
                <p className="stat-detail">Achieved goals</p>
              </div>

              <div className="stat-card">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{averageProgress}%</span>
                <p className="stat-detail">Average completion</p>
              </div>

              <div className="stat-card">
                <span className="stat-label">Streak</span>
                <span className="stat-value">7 days</span>
                <p className="stat-detail">Keep it up!</p>
              </div>
            </div>

            {/* Quick Goals Summary */}
            <div className="card">
              <h3>Quick Summary</h3>
              <div className="summary-list">
                {activeGoals.length > 0 ? (
                  activeGoals.slice(0, 3).map(goal => (
                    <div key={goal.id} className="summary-item">
                      <div className="summary-info">
                        <span className="summary-icon">{getGoalIcon(goal.goalType)}</span>
                        <div>
                          <strong>{goal.name}</strong>
                          <p className="summary-detail">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </p>
                        </div>
                      </div>
                      <div className="summary-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage(goal)}%` }}
                          />
                        </div>
                        <span className="progress-text">{Math.round(getProgressPercentage(goal))}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-goals">No active goals yet. Add your first goal!</p>
                )}
              </div>
            </div>

            {/* Add Goal Button */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : '+ Add New Goal'}
              </button>
            </div>
          </div>
        )}

        {/* My Goals Tab */}
        {activeTab === 'goals' && (
          <div className="tab-content">
            {showAddForm && (
              <div className="card add-goal-form">
                <h3>Create New Goal</h3>

                <div className="form-group">
                  <label>Goal Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Walk 10,000 steps daily"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label>Goal Type *</label>
                  <select
                    name="goalType"
                    value={formData.goalType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {goalTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Target Value *</label>
                    <input
                      type="number"
                      name="targetValue"
                      value={formData.targetValue}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Period</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="longterm">Long-term</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Why is this goal important to you?"
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date (Optional)</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-block"
                  onClick={handleAddGoal}
                >
                  Create Goal
                </button>
              </div>
            )}

            <div className="goals-list">
              {activeGoals.length > 0 ? (
                activeGoals.map(goal => (
                  <div
                    key={goal.id}
                    className={`goal-card ${isGoalAchieved(goal) ? 'achieved' : ''}`}
                  >
                    <div className="goal-header">
                      <div className="goal-title">
                        <span className="goal-icon">{getGoalIcon(goal.goalType)}</span>
                        <div>
                          <h4>{goal.name}</h4>
                          <p className="goal-category">{goal.category} goal</p>
                        </div>
                      </div>
                      {isGoalAchieved(goal) && (
                        <div className="goal-badge">Achieved!</div>
                      )}
                    </div>

                    <div className="goal-content">
                      {goal.description && (
                        <p className="goal-description">{goal.description}</p>
                      )}

                      <div className="goal-stats">
                        <div className="stat-item">
                          <span className="stat-name">Progress</span>
                          <span className="stat-val">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-name">Completion</span>
                          <span className="stat-val">{Math.round(getProgressPercentage(goal))}%</span>
                        </div>
                      </div>

                      <div className="goal-progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(goal)}%` }}
                        />
                      </div>
                    </div>

                    <div className="goal-footer">
                      <button className="btn btn-sm btn-primary">Update Progress</button>
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-secondary">Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No active goals</p>
                  <p className="hint">Create your first goal to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="tab-content">
            <div className="card">
              <h3>Weekly Progress</h3>
              <div className="progress-chart">
                <p className="chart-placeholder">
                  Interactive progress chart coming soon
                </p>
              </div>
            </div>

            <div className="card">
              <h3>Goal Progress Details</h3>
              <div className="progress-details">
                {activeGoals.map(goal => (
                  <div key={goal.id} className="progress-detail-item">
                    <div className="detail-header">
                      <strong>{goal.name}</strong>
                      <span className="percentage">{Math.round(getProgressPercentage(goal))}%</span>
                    </div>
                    <div className="detail-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(goal)}%` }}
                        />
                      </div>
                    </div>
                    <div className="detail-footer">
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      <span className="days-left">
                        {goal.endDate ? `Due: ${goal.endDate}` : 'No deadline'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="tab-content">
            <div className="achievements-grid">
              <div className="achievement-card unlocked">
                <div className="achievement-icon">1st</div>
                <h4>First Step</h4>
                <p>Created your first goal</p>
              </div>

              <div className="achievement-card unlocked">
                <div className="achievement-icon">7d</div>
                <h4>7-Day Streak</h4>
                <p>Logged data for 7 consecutive days</p>
              </div>

              <div className="achievement-card unlocked">
                <div className="achievement-icon">Fit</div>
                <h4>Active Lifestyle</h4>
                <p>Completed 10 exercise goals</p>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">25</div>
                <h4>Goal Master</h4>
                <p>Complete 25 goals (7/25)</p>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">30d</div>
                <h4>Fitness Champion</h4>
                <p>Maintain 30-day exercise streak</p>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">100</div>
                <h4>Perfect Score</h4>
                <p>Achieve all goals in one month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;

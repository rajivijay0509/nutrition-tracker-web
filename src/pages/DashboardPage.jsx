import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFoodStore } from '../store/foodStore';
import { useWellnessStore } from '../store/wellnessStore';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getDailyMeals, selectedDate, setSelectedDate } = useFoodStore();
  const { getWellness } = useWellnessStore();
  
  const [dailyMeals, setDailyMeals] = useState(null);
  const [wellness, setWellness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data - will be replaced with API calls
  const mockDailyData = {
    calories: 650,
    target: 850,
    protein: 75,
    carbs: 65,
    fat: 18,
    meals: [
      { time: '8:00 AM', name: 'Fat + Tea', calories: 116, status: 'logged' },
      { time: '10:00 AM', name: 'Egg Whites', calories: 136, status: 'logged' },
      { time: '12:00 PM', name: 'Broccoli Salad', calories: 234, status: 'logged' },
      { time: '2:00 PM', name: 'Protein Meal', status: 'not-logged' },
      { time: '4:00 PM', name: 'Vegetable Meal', status: 'not-logged' },
      { time: '6:00 PM', name: 'Protein / Fiber', status: 'not-logged' },
      { time: '8:00 PM', name: 'Fiber Drink', status: 'not-logged' },
    ],
  };

  const mockWellnessData = {
    mood: '😊',
    energy: 4,
    sleep: 7.5,
    symptoms: [],
  };

  const weekTrendData = [
    { date: 'Mon', calories: 745, target: 850 },
    { date: 'Tue', calories: 812, target: 850 },
    { date: 'Wed', calories: 690, target: 850 },
    { date: 'Thu', calories: 895, target: 850 },
    { date: 'Fri', calories: 760, target: 850 },
    { date: 'Sat', calories: 820, target: 850 },
    { date: 'Sun', calories: 650, target: 850 },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // In real app, fetch from API
      // const meals = await getDailyMeals(selectedDate);
      // const wellness = await getWellness(selectedDate);
      setDailyMeals(mockDailyData);
      setWellness(mockWellnessData);
      setLoading(false);
    };

    loadData();
  }, [selectedDate]);

  const caloriePercentage = Math.round((mockDailyData.calories / mockDailyData.target) * 100);
  const macroData = [
    { name: 'Protein', value: mockDailyData.protein, fill: '#06b6d4' },
    { name: 'Carbs', value: mockDailyData.carbs, fill: '#10b981' },
    { name: 'Fat', value: mockDailyData.fat, fill: '#f59e0b' },
  ];

  const handleMealClick = () => {
    navigate('/food-logging');
  };

  const handleWellnessClick = () => {
    navigate('/wellness');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Today's nutrition overview</p>
        </div>
        <div className="date-selector">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Calorie Tracker Card - Large */}
        <div className="card card-lg">
          <div className="card-header">
            <h3>Daily Calorie Intake</h3>
            <span className="badge badge-primary">{caloriePercentage}%</span>
          </div>
          <div className="card-body">
            <div className="calorie-tracker">
              <div className="calorie-circle">
                <svg className="progress-ring" width="200" height="200">
                  <circle
                    className="progress-ring-circle"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    r="90"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDasharray: `${(caloriePercentage / 100) * 565.48} 565.48`,
                    }}
                  />
                </svg>
                <div className="calorie-text">
                  <div className="calorie-value">{mockDailyData.calories}</div>
                  <div className="calorie-label">/ {mockDailyData.target} kcal</div>
                </div>
              </div>
              <div className="calorie-stats">
                <div className="stat-item">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value">{mockDailyData.target - mockDailyData.calories} kcal</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Logged Meals</span>
                  <span className="stat-value">3 / 7</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary btn-block" onClick={handleMealClick}>
              + Log Next Meal
            </button>
          </div>
        </div>

        {/* Macros & Wellness Cards */}
        <div className="cards-column">
          
          {/* Macros Card */}
          <div className="card">
            <h4>Macronutrients</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="macro-legend">
              {macroData.map((item) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.fill }}></span>
                  <span>{item.name}: {item.value}g</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Card */}
          <div className="card">
            <h4>Wellness Check</h4>
            <div className="wellness-grid">
              <div className="wellness-item">
                <span className="wellness-emoji">{wellness?.mood || '😐'}</span>
                <span className="wellness-label">Mood</span>
              </div>
              <div className="wellness-item">
                <span className="wellness-value">{wellness?.energy || 3}/5</span>
                <span className="wellness-label">Energy</span>
              </div>
              <div className="wellness-item">
                <span className="wellness-value">{wellness?.sleep || 0}h</span>
                <span className="wellness-label">Sleep</span>
              </div>
            </div>
            <button className="btn btn-secondary btn-block mt-md" onClick={handleWellnessClick}>
              Update Wellness
            </button>
          </div>
        </div>
      </div>

      {/* Meals Today */}
      <div className="card">
        <div className="card-header">
          <h3>Today's Meals</h3>
          <span className="badge badge-success">3 Logged</span>
        </div>
        <div className="meals-list">
          {mockDailyData.meals.map((meal, idx) => (
            <div key={idx} className={`meal-item ${meal.status}`}>
              <div className="meal-info">
                <span className="meal-time">{meal.time}</span>
                <span className="meal-name">{meal.name}</span>
              </div>
              {meal.status === 'logged' && (
                <>
                  <span className="meal-calories">{meal.calories} kcal</span>
                  <span className="status-badge">✓</span>
                </>
              )}
              {meal.status === 'not-logged' && (
                <button className="btn btn-sm btn-secondary" onClick={handleMealClick}>
                  Log
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="card">
        <h3>Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weekTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }}
              name="Actual"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#d1d5db" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;

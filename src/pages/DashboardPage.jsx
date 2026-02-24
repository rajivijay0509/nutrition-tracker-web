import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFoodStore } from '../store/foodStore';
import { useWellnessStore } from '../store/wellnessStore';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getDailyMeals, selectedDate, setSelectedDate, meals } = useFoodStore();
  const { getWellness, wellness: wellnessStore } = useWellnessStore();

  const [dailyMeals, setDailyMeals] = useState([]);
  const [wellness, setWellness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekTrendData, setWeekTrendData] = useState([]);

  // Target values (default, should come from profile settings)
  const DAILY_CALORIE_TARGET = 850;

  // Calculate daily metrics from stored meals
  const calculateDailyMetrics = (mealsArray) => {
    if (!mealsArray || mealsArray.length === 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        loggedCount: 0,
      };
    }

    const totals = mealsArray.reduce((acc, meal) => {
      const foodItems = meal.foodItems || [];
      const mealCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);

      return {
        calories: acc.calories + mealCalories,
        loggedCount: acc.loggedCount + 1,
        // Approximate macros based on typical distribution
        protein: acc.protein + (mealCalories * 0.25) / 4, // 25% protein
        carbs: acc.carbs + (mealCalories * 0.50) / 4, // 50% carbs
        fat: acc.fat + (mealCalories * 0.25) / 9, // 25% fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, loggedCount: 0 });

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      loggedCount: totals.loggedCount,
    };
  };

  // Format meals for display
  const formatMealsForDisplay = (mealsArray) => {
    const mealTimes = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

    if (!mealsArray || mealsArray.length === 0) {
      return mealTimes.map((time, idx) => ({
        time,
        name: 'Log meal',
        calories: 0,
        status: 'not-logged',
      }));
    }

    // Create a map of logged meals by time
    const mealMap = new Map();
    mealsArray.forEach(meal => {
      mealMap.set(meal.mealTimeSlot, meal);
    });

    // Create display array with logged and not-logged meals
    return mealTimes.map(time => {
      const meal = mealMap.get(time);
      if (meal) {
        const foodNames = meal.foodItems?.map(f => f.foodName).join(', ') || 'Logged meal';
        return {
          time,
          name: foodNames,
          calories: meal.calories || 0,
          status: 'logged',
        };
      }
      return {
        time,
        name: 'Log meal',
        calories: 0,
        status: 'not-logged',
      };
    });
  };

  // Generate week trend data
  const generateWeekTrendData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();

    return days.map((dayName, idx) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - idx));
      const dateStr = date.toISOString().split('T')[0];

      // Get meals for this date from store
      const dayMeals = meals[dateStr] || [];
      const dayMetrics = calculateDailyMetrics(dayMeals);

      return {
        date: dayName,
        calories: dayMetrics.calories,
        target: DAILY_CALORIE_TARGET,
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch meals for selected date
        const fetchedMeals = await getDailyMeals(selectedDate);
        const mealsArray = Array.isArray(fetchedMeals) ? fetchedMeals : (fetchedMeals?.meals || []);
        setDailyMeals(mealsArray);

        // Fetch wellness for selected date
        const fetchedWellness = await getWellness(selectedDate);
        setWellness(fetchedWellness || {
          moodEmoji: ':-|',
          energyLevel: 3,
          sleepHours: 0,
        });

        // Generate week trend
        setWeekTrendData(generateWeekTrendData());
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDate, meals]);

  // Calculate current day metrics
  const dailyMetrics = calculateDailyMetrics(dailyMeals);
  const caloriePercentage = Math.round((dailyMetrics.calories / DAILY_CALORIE_TARGET) * 100);
  const macroData = [
    { name: 'Protein', value: dailyMetrics.protein, fill: '#06b6d4' },
    { name: 'Carbs', value: dailyMetrics.carbs, fill: '#10b981' },
    { name: 'Fat', value: dailyMetrics.fat, fill: '#f59e0b' },
  ];
  const displayMeals = formatMealsForDisplay(dailyMeals);

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
                  <div className="calorie-value">{dailyMetrics.calories}</div>
                  <div className="calorie-label">/ {DAILY_CALORIE_TARGET} kcal</div>
                </div>
              </div>
              <div className="calorie-stats">
                <div className="stat-item">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value">{Math.max(DAILY_CALORIE_TARGET - dailyMetrics.calories, 0)} kcal</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Logged Meals</span>
                  <span className="stat-value">{dailyMetrics.loggedCount} / 7</span>
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
                <span className="wellness-emoji">{wellness?.moodEmoji || ':-|'}</span>
                <span className="wellness-label">Mood</span>
              </div>
              <div className="wellness-item">
                <span className="wellness-value">{wellness?.energyLevel || 3}/5</span>
                <span className="wellness-label">Energy</span>
              </div>
              <div className="wellness-item">
                <span className="wellness-value">{wellness?.sleepHours || 0}h</span>
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
          <span className="badge badge-success">{dailyMetrics.loggedCount} Logged</span>
        </div>
        <div className="meals-list">
          {displayMeals.map((meal, idx) => (
            <div key={idx} className={`meal-item ${meal.status}`}>
              <div className="meal-info">
                <span className="meal-time">{meal.time}</span>
                <span className="meal-name">{meal.name}</span>
              </div>
              {meal.status === 'logged' && (
                <>
                  <span className="meal-calories">{meal.calories} kcal</span>
                  <span className="status-badge">Done</span>
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

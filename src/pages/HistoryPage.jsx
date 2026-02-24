import React, { useState, useEffect } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useWellnessStore } from '../store/wellnessStore';
import '../styles/History.css';

const HistoryPage = () => {
  const { meals } = useFoodStore();
  const { wellness } = useWellnessStore();

  const [filterType, setFilterType] = useState('all'); // all, food, wellness
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get dates in range
  const getDatesInRange = () => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    while (start <= end) {
      dates.push(start.toISOString().split('T')[0]);
      start.setDate(start.getDate() + 1);
    }

    return dates.sort().reverse(); // Most recent first
  };

  const datesInRange = getDatesInRange();

  // Helper to safely get meals array for a date
  const getMealsForDate = (date) => {
    const data = meals[date];
    return Array.isArray(data) ? data : (data?.meals || []);
  };

  // Calculate statistics
  const calculateStats = () => {
    const allMeals = datesInRange
      .flatMap(date => getMealsForDate(date))
      .filter(m => !searchQuery || m.foodItems?.some(f => f.foodName?.toLowerCase().includes(searchQuery.toLowerCase())));

    const totalCalories = allMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const avgCalories = allMeals.length > 0 ? Math.round(totalCalories / datesInRange.length) : 0;
    const daysLogged = datesInRange.filter(date => getMealsForDate(date).length > 0).length;

    return {
      totalDays: datesInRange.length,
      daysLogged,
      totalCalories,
      avgCalories,
      totalMeals: allMeals.length,
    };
  };

  const stats = calculateStats();

  // Get day details
  const getDayDetails = (date) => {
    const dayMeals = getMealsForDate(date);
    const dayWellness = wellness[date];
    const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    return {
      date,
      meals: dayMeals,
      wellness: dayWellness,
      totalCalories,
      status: dayMeals.length > 0 ? 'logged' : 'pending',
    };
  };

  // Filter data
  const getFilteredData = () => {
    return datesInRange.map(date => getDayDetails(date)).filter(day => {
      if (filterType === 'food') return day.meals.length > 0;
      if (filterType === 'wellness') return day.wellness;
      return true;
    });
  };

  const filteredData = getFilteredData();

  return (
    <div className="history-container">
      {/* Header */}
      <div className="page-header">
        <h1>History & Analytics</h1>
        <p>View your nutrition and wellness data over time</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Days Tracked</span>
          <span className="stat-value">{stats.daysLogged}/{stats.totalDays}</span>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${(stats.daysLogged / stats.totalDays) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Avg Calories</span>
          <span className="stat-value">{stats.avgCalories}</span>
          <span className="stat-unit">kcal/day</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Calories</span>
          <span className="stat-value">{stats.totalCalories}</span>
          <span className="stat-unit">kcal</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Meals Logged</span>
          <span className="stat-value">{stats.totalMeals}</span>
          <span className="stat-unit">meals</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card filters-card">
        <div className="filter-group">
          <div className="date-range">
            <div className="date-input-group">
              <label>From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-input-group">
              <label>To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterType === 'food' ? 'active' : ''}`}
              onClick={() => setFilterType('food')}
            >
              Food
            </button>
            <button
              className={`filter-btn ${filterType === 'wellness' ? 'active' : ''}`}
              onClick={() => setFilterType('wellness')}
            >
              Wellness
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Data View */}
      <div className="history-view">
        {filteredData.length > 0 ? (
          <div className="days-list">
            {filteredData.map((day) => (
              <div
                key={day.date}
                className={`day-card ${selectedDay === day.date ? 'expanded' : ''}`}
              >
                <div
                  className="day-header"
                  onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
                >
                  <div className="day-info">
                    <span className="day-date">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="day-status-badge" style={{
                      backgroundColor: day.status === 'logged' ? '#d1fae5' : '#fee2e2',
                      color: day.status === 'logged' ? '#065f46' : '#991b1b'
                    }}>
                      {day.status === 'logged' ? 'Logged' : 'Pending'}
                    </span>
                  </div>
                  <div className="day-summary">
                    <span className="calories-badge">{day.totalCalories} kcal</span>
                    <span className="meals-count">{day.meals.length} meals</span>
                  </div>
                </div>

                {selectedDay === day.date && (
                  <div className="day-details">
                    {/* Meals */}
                    {day.meals.length > 0 && (
                      <div className="details-section">
                        <h4>Meals ({day.meals.length})</h4>
                        {day.meals.map((meal, idx) => (
                          <div key={idx} className="meal-detail">
                            <strong>{meal.mealTimeSlot}</strong>
                            <div className="meal-items-list">
                              {meal.foodItems?.map((item, itemIdx) => (
                                <div key={itemIdx} className="meal-item-detail">
                                  {item.foodName} - {item.quantity} {item.unit} ({item.calories} kcal)
                                </div>
                              ))}
                            </div>
                            {meal.notes && (
                              <p className="meal-notes-detail">{meal.notes}</p>
                            )}
                            {meal.photo && (
                              <div className="meal-photo-detail">
                                <img src={meal.photo} alt="Meal" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Wellness */}
                    {day.wellness && (
                      <div className="details-section">
                        <h4>Wellness</h4>
                        <div className="wellness-detail-grid">
                          <div className="wellness-detail-item">
                            <span className="label">Mood</span>
                            <span className="value">{day.wellness.moodEmoji}</span>
                          </div>
                          <div className="wellness-detail-item">
                            <span className="label">Energy</span>
                            <span className="value">{day.wellness.energyLevel}/5</span>
                          </div>
                          <div className="wellness-detail-item">
                            <span className="label">Sleep</span>
                            <span className="value">{day.wellness.sleepHours}h</span>
                          </div>
                          <div className="wellness-detail-item">
                            <span className="label">Exercise</span>
                            <span className="value">{day.wellness.exerciseMinutes}m</span>
                          </div>
                        </div>
                        {day.wellness.notes && (
                          <p className="wellness-notes">{day.wellness.notes}</p>
                        )}
                      </div>
                    )}

                    {day.meals.length === 0 && !day.wellness && (
                      <p className="no-data">No data logged for this day</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No data found for the selected filters</p>
            <p className="hint">Try adjusting your date range or filters</p>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="card export-section">
        <h3>Export Data</h3>
        <p>Download your health data in CSV or PDF format</p>
        <div className="export-buttons">
          <button className="btn btn-secondary" onClick={() => alert('Export to CSV coming soon')}>
            Export as CSV
          </button>
          <button className="btn btn-secondary" onClick={() => alert('Export to PDF coming soon')}>
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

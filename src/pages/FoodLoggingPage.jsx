import React, { useState, useEffect } from 'react';
import { useFoodStore } from '../store/foodStore';
import '../styles/FoodLogging.css';

const FoodLoggingPage = () => {
  const { logMeal, getDailyMeals, selectedDate, setSelectedDate, meals } = useFoodStore();

  const [currentPhase, setCurrentPhase] = useState('v5');
  const [mealTimeSlot, setMealTimeSlot] = useState('8:00 AM');
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('g');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Phase definitions with meal timings
  const phases = {
    v0: {
      name: 'V0 - Beginner',
      color: '#6b7280',
      mealTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
      description: 'Foundation phase - 5 meals per day',
    },
    v1: {
      name: 'V1 - Foundation',
      color: '#3b82f6',
      mealTimes: ['8:00 AM', '10:30 AM', '1:00 PM', '4:00 PM', '7:00 PM'],
      description: '5 meals with adjusted timings',
    },
    v2: {
      name: 'V2 - Building',
      color: '#10b981',
      mealTimes: ['7:30 AM', '10:00 AM', '12:30 PM', '3:30 PM', '6:30 PM', '8:30 PM'],
      description: '6 meals per day - Building phase',
    },
    v3: {
      name: 'V3 - Progressive',
      color: '#f59e0b',
      mealTimes: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
      description: '7 meals per day - Progressive phase',
    },
    v4: {
      name: 'V4 - Intermediate',
      color: '#8b5cf6',
      mealTimes: ['6:30 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'],
      description: '8 meals per day - Intermediate phase',
    },
    v5: {
      name: 'V5 - Advanced',
      color: '#06b6d4',
      mealTimes: ['6:00 AM', '7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'],
      description: '9 meals per day - Advanced phase (Current)',
    },
    v6: {
      name: 'V6 - Expert',
      color: '#ef4444',
      mealTimes: ['5:30 AM', '7:00 AM', '8:30 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'],
      description: '10 meals per day - Expert phase',
    },
  };

  // Complete V5 Food Database
  const foodDatabase = {
    grains: [
      { name: 'White Rice', quantity: 30, unit: 'g', calories: 110, category: 'Grains' },
      { name: 'Brown Rice', quantity: 30, unit: 'g', calories: 110, category: 'Grains' },
      { name: 'Basmathi Rice', quantity: 30, unit: 'g', calories: 107, category: 'Grains' },
      { name: 'Black Rice', quantity: 30, unit: 'g', calories: 96, category: 'Grains' },
      { name: 'Sushi Rice', quantity: 30, unit: 'g', calories: 106, category: 'Grains' },
      { name: 'Flattened Rice (Poha)', quantity: 30, unit: 'g', calories: 106, category: 'Grains' },
      { name: 'Puffed Rice', quantity: 30, unit: 'g', calories: 109, category: 'Grains' },
      { name: 'Pearl Millet (Bajra)', quantity: 30, unit: 'g', calories: 104, category: 'Grains' },
      { name: 'Foxtail Millet (Kanji)', quantity: 30, unit: 'g', calories: 109, category: 'Grains' },
      { name: 'Sorghum (Jowar)', quantity: 30, unit: 'g', calories: 105, category: 'Grains' },
      { name: 'Finger Millet (Ragi)', quantity: 30, unit: 'g', calories: 96, category: 'Grains' },
      { name: 'Brown Top Millet', quantity: 30, unit: 'g', calories: 101, category: 'Grains' },
      { name: 'Barnyard Millet', quantity: 30, unit: 'g', calories: 92, category: 'Grains' },
      { name: 'Kodo Millet', quantity: 30, unit: 'g', calories: 106, category: 'Grains' },
      { name: 'Little Millet', quantity: 30, unit: 'g', calories: 104, category: 'Grains' },
      { name: 'Proso Millet', quantity: 30, unit: 'g', calories: 102, category: 'Grains' },
      { name: 'Quinoa', quantity: 30, unit: 'g', calories: 99, category: 'Grains' },
      { name: 'Oats', quantity: 30, unit: 'g', calories: 113, category: 'Grains' },
      { name: 'Sabudana (Sago)', quantity: 30, unit: 'g', calories: 107, category: 'Grains' },
      { name: 'Amaranth', quantity: 30, unit: 'g', calories: 107, category: 'Grains' },
      { name: 'Adlai', quantity: 30, unit: 'g', calories: 113, category: 'Grains' },
      { name: 'Buckwheat', quantity: 30, unit: 'g', calories: 97, category: 'Grains' },
    ],
    fruits: [
      { name: 'Apple', quantity: 100, unit: 'g', calories: 52, category: 'Fruits' },
      { name: 'Apricot', quantity: 100, unit: 'g', calories: 48, category: 'Fruits' },
      { name: 'Banana', quantity: 100, unit: 'g', calories: 105, category: 'Fruits' },
      { name: 'Cantaloupe', quantity: 100, unit: 'g', calories: 34, category: 'Fruits' },
      { name: 'Cherry', quantity: 100, unit: 'g', calories: 60, category: 'Fruits' },
      { name: 'Clementine', quantity: 100, unit: 'g', calories: 45, category: 'Fruits' },
      { name: 'Dragon Fruit', quantity: 100, unit: 'g', calories: 60, category: 'Fruits' },
      { name: 'Durian', quantity: 100, unit: 'g', calories: 147, category: 'Fruits' },
      { name: 'Fig', quantity: 100, unit: 'g', calories: 74, category: 'Fruits' },
      { name: 'Grapes', quantity: 100, unit: 'g', calories: 94, category: 'Fruits' },
      { name: 'Grapefruit', quantity: 100, unit: 'g', calories: 42, category: 'Fruits' },
      { name: 'Guava', quantity: 100, unit: 'g', calories: 68, category: 'Fruits' },
      { name: 'Honeydew', quantity: 100, unit: 'g', calories: 36, category: 'Fruits' },
      { name: 'Jackfruit', quantity: 100, unit: 'g', calories: 72, category: 'Fruits' },
      { name: 'Kiwi Fruit', quantity: 100, unit: 'g', calories: 58, category: 'Fruits' },
      { name: 'Lychee', quantity: 100, unit: 'g', calories: 54, category: 'Fruits' },
      { name: 'Mango', quantity: 100, unit: 'g', calories: 59, category: 'Fruits' },
      { name: 'Orange', quantity: 100, unit: 'g', calories: 47, category: 'Fruits' },
      { name: 'Papaya', quantity: 100, unit: 'g', calories: 24, category: 'Fruits' },
      { name: 'Passion Fruit', quantity: 100, unit: 'g', calories: 97, category: 'Fruits' },
      { name: 'Peach', quantity: 100, unit: 'g', calories: 40, category: 'Fruits' },
      { name: 'Pear', quantity: 100, unit: 'g', calories: 57, category: 'Fruits' },
      { name: 'Pineapple', quantity: 100, unit: 'g', calories: 50, category: 'Fruits' },
      { name: 'Plum', quantity: 100, unit: 'g', calories: 46, category: 'Fruits' },
      { name: 'Pomegranate', quantity: 100, unit: 'g', calories: 83, category: 'Fruits' },
      { name: 'Star Fruit', quantity: 100, unit: 'g', calories: 31, category: 'Fruits' },
      { name: 'Sapota (Chickoo)', quantity: 100, unit: 'g', calories: 73, category: 'Fruits' },
      { name: 'Tangerine', quantity: 100, unit: 'g', calories: 53, category: 'Fruits' },
      { name: 'Watermelon', quantity: 100, unit: 'g', calories: 30, category: 'Fruits' },
      { name: 'Custard Apple', quantity: 100, unit: 'g', calories: 99, category: 'Fruits' },
    ],
  };

  // Flatten all foods for searching
  const allFoods = [...foodDatabase.grains, ...foodDatabase.fruits];

  // Filter foods based on search
  const filteredFoods = allFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current phase config
  const currentPhaseConfig = phases[currentPhase];
  const currentMealTimes = currentPhaseConfig.mealTimes;

  // Calculate calories for selected food
  const getCalories = (food, qty, u) => {
    if (!food) return 0;
    if (u === food.unit) {
      return Math.round((qty / food.quantity) * food.calories);
    }
    return 0;
  };

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
    setMealTimeSlot(phases[phase].mealTimes[0]);
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food.name);
    setQuantity(1);
    setUnit(food.unit);
    setSearchQuery('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleLogMeal = async () => {
    if (!selectedFood || !mealTimeSlot) {
      setError('Please select a food and meal time');
      return;
    }

    try {
      const selectedFoodData = allFoods.find(f => f.name === selectedFood);
      const calories = getCalories(selectedFoodData, quantity, unit);

      const mealData = {
        date: selectedDate,
        mealTimeSlot,
        foodName: selectedFood,
        quantity,
        unit,
        calories,
        notes,
        photo: photoPreview,
        phase: currentPhase,
        loggedAt: new Date().toISOString(),
      };

      await logMeal(mealData);

      setSuccess(`✅ Logged ${selectedFood} - ${calories} kcal`);
      setSelectedFood('');
      setQuantity(1);
      setNotes('');
      setPhotoPreview(null);
      setPhotoFile(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to log meal');
    }
  };

  const getSelectedFoodInfo = () => {
    return allFoods.find(f => f.name === selectedFood);
  };

  const selectedFoodInfo = getSelectedFoodInfo();
  const caloriesForQuantity = selectedFoodInfo ? getCalories(selectedFoodInfo, quantity, unit) : 0;

  return (
    <div className="food-logging-container">
      {/* Header */}
      <div className="page-header">
        <h1>📋 Food Logging</h1>
        <p>Log your meals across 6 phases (V0-V6) with the comprehensive V5 diet list</p>
      </div>

      {/* Phase Selector */}
      <div className="phase-selector">
        <h3>Select Your Phase</h3>
        <div className="phase-buttons">
          {Object.entries(phases).map(([key, phase]) => (
            <button
              key={key}
              className={`phase-btn ${currentPhase === key ? 'active' : ''}`}
              onClick={() => handlePhaseChange(key)}
              style={{
                borderColor: phase.color,
                backgroundColor: currentPhase === key ? phase.color : 'transparent',
                color: currentPhase === key ? 'white' : phase.color,
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="phase-info">
          <strong>{currentPhaseConfig.name}</strong> - {currentPhaseConfig.description}
        </p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Main Form */}
      <div className="card food-logging-form">
        <div className="form-row">
          {/* Date Selector */}
          <div className="form-group">
            <label>📅 Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Meal Time Selector */}
          <div className="form-group">
            <label>🕐 Meal Time ({currentMealTimes.length} per day in {currentPhaseConfig.name})</label>
            <select
              value={mealTimeSlot}
              onChange={(e) => setMealTimeSlot(e.target.value)}
              className="input-field"
            >
              {currentMealTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Food Search & Selection */}
        <div className="form-group">
          <label>🍽️ Search & Select Food (54 items from V5 Diet List)</label>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search grains, fruits... (e.g., Rice, Apple, Millet)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
            {searchQuery && filteredFoods.length > 0 && (
              <div className="food-suggestions">
                {filteredFoods.slice(0, 10).map((food, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div className="suggestion-name">{food.name}</div>
                    <div className="suggestion-info">
                      {food.quantity}{food.unit} = {food.calories} kcal
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Food Display */}
        {selectedFood && (
          <div className="selected-food-display">
            <div className="selected-food-info">
              <strong>{selectedFood}</strong>
              <p>Base: {selectedFoodInfo?.quantity}{selectedFoodInfo?.unit} = {selectedFoodInfo?.calories} kcal</p>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        {selectedFood && (
          <div className="form-row">
            <div className="form-group">
              <label>📏 Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                min="0.1"
                step="0.1"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                value={unit}
                readOnly
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>🔥 Calculated Calories</label>
              <input
                type="text"
                value={`${caloriesForQuantity} kcal`}
                readOnly
                className="input-field calories-display"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label>📝 Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Added oil, salt level, taste notes..."
            className="input-field"
            rows="2"
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>📸 Upload Photo (Optional)</label>
          {photoPreview ? (
            <div className="photo-preview">
              <img src={photoPreview} alt="meal preview" />
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleRemovePhoto}
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="input-field file-input"
            />
          )}
        </div>

        {/* Log Button */}
        <button
          className="btn btn-primary btn-block"
          onClick={handleLogMeal}
          disabled={!selectedFood}
        >
          ✅ Log Meal
        </button>
      </div>

      {/* Today's Meals Summary */}
      {meals[selectedDate] && meals[selectedDate].length > 0 && (
        <div className="card">
          <h3>📊 Today's Logged Meals ({currentPhaseConfig.name})</h3>
          <div className="meals-summary">
            {currentMealTimes.map((time) => {
              const mealAtTime = meals[selectedDate].find(m => m.mealTimeSlot === time);
              return (
                <div key={time} className={`meal-summary-item ${mealAtTime ? 'logged' : ''}`}>
                  <span className="meal-time">{time}</span>
                  {mealAtTime ? (
                    <div className="meal-details">
                      <span className="meal-name">{mealAtTime.foodName}</span>
                      <span className="meal-calories">{mealAtTime.calories} kcal</span>
                    </div>
                  ) : (
                    <span className="meal-empty">-</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLoggingPage;

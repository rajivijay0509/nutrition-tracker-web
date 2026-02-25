import React, { useState, useEffect } from 'react';
import { useFoodStore } from '../store/foodStore';
import '../styles/FoodLogging.css';

const FoodLoggingPage = () => {
  const { logMeal, getDailyMeals, selectedDate, setSelectedDate, meals } = useFoodStore();

  const [currentPhase, setCurrentPhase] = useState('v5');
  const [mealTimeSlot, setMealTimeSlot] = useState('6:00 AM');
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('g');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Phase definitions with meal timings
  const phases = {
    v0: {
      name: 'Beginner',
      color: '#6b7280',
      mealTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
      description: 'Foundation phase - 5 meals per day',
      icon: '🌱',
      mealsPerDay: 5,
    },
    v1: {
      name: 'Foundation',
      color: '#3b82f6',
      mealTimes: ['8:00 AM', '10:30 AM', '1:00 PM', '4:00 PM', '7:00 PM'],
      description: '5 meals with adjusted timings',
      icon: '🏃',
      mealsPerDay: 5,
    },
    v2: {
      name: 'Building',
      color: '#10b981',
      mealTimes: ['7:30 AM', '10:00 AM', '12:30 PM', '3:30 PM', '6:30 PM', '8:30 PM'],
      description: '6 meals per day - Building phase',
      icon: '💪',
      mealsPerDay: 6,
    },
    v3: {
      name: 'Progressive',
      color: '#f59e0b',
      mealTimes: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
      description: '7 meals per day - Progressive phase',
      icon: '🔥',
      mealsPerDay: 7,
    },
    v4: {
      name: 'Intermediate',
      color: '#8b5cf6',
      mealTimes: ['6:30 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'],
      description: '8 meals per day - Intermediate phase',
      icon: '⚡',
      mealsPerDay: 8,
    },
    v5: {
      name: 'Advanced',
      color: '#06b6d4',
      mealTimes: ['6:00 AM', '7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'],
      description: '9 meals per day - Advanced phase',
      icon: '🚀',
      mealsPerDay: 9,
    },
    v6: {
      name: 'Expert',
      color: '#ef4444',
      mealTimes: ['5:30 AM', '7:00 AM', '8:30 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'],
      description: '10 meals per day - Expert phase',
      icon: '🏆',
      mealsPerDay: 10,
    },
  };

  // Complete Food Database - All phases V0-V6
  const foodDatabase = {
    proteins: [
      { name: 'Egg Whites', quantity: 4, unit: 'nos', calories: 68, category: 'Proteins' },
      { name: 'Whole Egg', quantity: 1, unit: 'nos', calories: 78, category: 'Proteins' },
      { name: 'Chicken Breast', quantity: 100, unit: 'g', calories: 165, category: 'Proteins' },
      { name: 'Chicken Thigh', quantity: 100, unit: 'g', calories: 209, category: 'Proteins' },
      { name: 'Turkey Breast', quantity: 100, unit: 'g', calories: 135, category: 'Proteins' },
      { name: 'Salmon', quantity: 100, unit: 'g', calories: 206, category: 'Proteins' },
      { name: 'Tuna', quantity: 100, unit: 'g', calories: 132, category: 'Proteins' },
      { name: 'Sardines', quantity: 100, unit: 'g', calories: 208, category: 'Proteins' },
      { name: 'Mackerel', quantity: 100, unit: 'g', calories: 205, category: 'Proteins' },
      { name: 'Prawns/Shrimp', quantity: 100, unit: 'g', calories: 99, category: 'Proteins' },
      { name: 'Paneer', quantity: 100, unit: 'g', calories: 265, category: 'Proteins' },
      { name: 'Tofu', quantity: 100, unit: 'g', calories: 76, category: 'Proteins' },
      { name: 'Tempeh', quantity: 100, unit: 'g', calories: 193, category: 'Proteins' },
      { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 59, category: 'Proteins' },
      { name: 'Cottage Cheese', quantity: 100, unit: 'g', calories: 98, category: 'Proteins' },
      { name: 'Whey Protein', quantity: 1, unit: 'scoop', calories: 120, category: 'Proteins' },
      { name: 'Casein Protein', quantity: 1, unit: 'scoop', calories: 110, category: 'Proteins' },
    ],
    legumes: [
      { name: 'Chickpeas (Chana)', quantity: 100, unit: 'g', calories: 164, category: 'Legumes' },
      { name: 'Black Beans', quantity: 100, unit: 'g', calories: 132, category: 'Legumes' },
      { name: 'Kidney Beans (Rajma)', quantity: 100, unit: 'g', calories: 127, category: 'Legumes' },
      { name: 'Lentils (Dal)', quantity: 100, unit: 'g', calories: 116, category: 'Legumes' },
      { name: 'Moong Dal', quantity: 100, unit: 'g', calories: 105, category: 'Legumes' },
      { name: 'Toor Dal', quantity: 100, unit: 'g', calories: 110, category: 'Legumes' },
      { name: 'Urad Dal', quantity: 100, unit: 'g', calories: 105, category: 'Legumes' },
      { name: 'Masoor Dal', quantity: 100, unit: 'g', calories: 108, category: 'Legumes' },
      { name: 'Edamame', quantity: 100, unit: 'g', calories: 121, category: 'Legumes' },
      { name: 'Peas', quantity: 100, unit: 'g', calories: 81, category: 'Legumes' },
    ],
    grains: [
      { name: 'White Rice', quantity: 30, unit: 'g', calories: 110, category: 'Grains' },
      { name: 'Brown Rice', quantity: 30, unit: 'g', calories: 110, category: 'Grains' },
      { name: 'Basmati Rice', quantity: 30, unit: 'g', calories: 107, category: 'Grains' },
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
      { name: 'Wheat Bread', quantity: 1, unit: 'slice', calories: 79, category: 'Grains' },
      { name: 'Whole Wheat Roti', quantity: 1, unit: 'nos', calories: 71, category: 'Grains' },
      { name: 'Multigrain Bread', quantity: 1, unit: 'slice', calories: 69, category: 'Grains' },
    ],
    vegetables: [
      { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, category: 'Vegetables' },
      { name: 'Spinach', quantity: 100, unit: 'g', calories: 23, category: 'Vegetables' },
      { name: 'Kale', quantity: 100, unit: 'g', calories: 49, category: 'Vegetables' },
      { name: 'Cabbage', quantity: 100, unit: 'g', calories: 25, category: 'Vegetables' },
      { name: 'Cauliflower', quantity: 100, unit: 'g', calories: 25, category: 'Vegetables' },
      { name: 'Carrot', quantity: 100, unit: 'g', calories: 41, category: 'Vegetables' },
      { name: 'Beetroot', quantity: 100, unit: 'g', calories: 43, category: 'Vegetables' },
      { name: 'Bell Pepper', quantity: 100, unit: 'g', calories: 31, category: 'Vegetables' },
      { name: 'Cucumber', quantity: 100, unit: 'g', calories: 16, category: 'Vegetables' },
      { name: 'Tomato', quantity: 100, unit: 'g', calories: 18, category: 'Vegetables' },
      { name: 'Onion', quantity: 100, unit: 'g', calories: 40, category: 'Vegetables' },
      { name: 'Garlic', quantity: 10, unit: 'g', calories: 15, category: 'Vegetables' },
      { name: 'Ginger', quantity: 10, unit: 'g', calories: 8, category: 'Vegetables' },
      { name: 'Zucchini', quantity: 100, unit: 'g', calories: 17, category: 'Vegetables' },
      { name: 'Eggplant (Brinjal)', quantity: 100, unit: 'g', calories: 25, category: 'Vegetables' },
      { name: 'Bottle Gourd (Lauki)', quantity: 100, unit: 'g', calories: 14, category: 'Vegetables' },
      { name: 'Bitter Gourd (Karela)', quantity: 100, unit: 'g', calories: 17, category: 'Vegetables' },
      { name: 'Ridge Gourd (Turai)', quantity: 100, unit: 'g', calories: 20, category: 'Vegetables' },
      { name: 'Okra (Bhindi)', quantity: 100, unit: 'g', calories: 33, category: 'Vegetables' },
      { name: 'Green Beans', quantity: 100, unit: 'g', calories: 31, category: 'Vegetables' },
      { name: 'Mushrooms', quantity: 100, unit: 'g', calories: 22, category: 'Vegetables' },
      { name: 'Asparagus', quantity: 100, unit: 'g', calories: 20, category: 'Vegetables' },
      { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, category: 'Vegetables' },
      { name: 'Potato', quantity: 100, unit: 'g', calories: 77, category: 'Vegetables' },
      { name: 'Corn', quantity: 100, unit: 'g', calories: 86, category: 'Vegetables' },
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
      { name: 'Kiwi', quantity: 100, unit: 'g', calories: 58, category: 'Fruits' },
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
      { name: 'Blueberries', quantity: 100, unit: 'g', calories: 57, category: 'Fruits' },
      { name: 'Strawberries', quantity: 100, unit: 'g', calories: 33, category: 'Fruits' },
      { name: 'Raspberries', quantity: 100, unit: 'g', calories: 52, category: 'Fruits' },
      { name: 'Avocado', quantity: 100, unit: 'g', calories: 160, category: 'Fruits' },
    ],
    nuts: [
      { name: 'Almonds', quantity: 28, unit: 'g', calories: 164, category: 'Nuts & Seeds' },
      { name: 'Walnuts', quantity: 28, unit: 'g', calories: 185, category: 'Nuts & Seeds' },
      { name: 'Cashews', quantity: 28, unit: 'g', calories: 157, category: 'Nuts & Seeds' },
      { name: 'Pistachios', quantity: 28, unit: 'g', calories: 159, category: 'Nuts & Seeds' },
      { name: 'Peanuts', quantity: 28, unit: 'g', calories: 161, category: 'Nuts & Seeds' },
      { name: 'Macadamia Nuts', quantity: 28, unit: 'g', calories: 204, category: 'Nuts & Seeds' },
      { name: 'Brazil Nuts', quantity: 28, unit: 'g', calories: 187, category: 'Nuts & Seeds' },
      { name: 'Chia Seeds', quantity: 15, unit: 'g', calories: 73, category: 'Nuts & Seeds' },
      { name: 'Flax Seeds', quantity: 15, unit: 'g', calories: 80, category: 'Nuts & Seeds' },
      { name: 'Pumpkin Seeds', quantity: 28, unit: 'g', calories: 151, category: 'Nuts & Seeds' },
      { name: 'Sunflower Seeds', quantity: 28, unit: 'g', calories: 164, category: 'Nuts & Seeds' },
      { name: 'Hemp Seeds', quantity: 28, unit: 'g', calories: 155, category: 'Nuts & Seeds' },
    ],
    dairy: [
      { name: 'Whole Milk', quantity: 100, unit: 'ml', calories: 61, category: 'Dairy' },
      { name: 'Skim Milk', quantity: 100, unit: 'ml', calories: 35, category: 'Dairy' },
      { name: 'Almond Milk', quantity: 100, unit: 'ml', calories: 17, category: 'Dairy' },
      { name: 'Soy Milk', quantity: 100, unit: 'ml', calories: 33, category: 'Dairy' },
      { name: 'Oat Milk', quantity: 100, unit: 'ml', calories: 47, category: 'Dairy' },
      { name: 'Coconut Milk', quantity: 100, unit: 'ml', calories: 154, category: 'Dairy' },
      { name: 'Curd/Yogurt', quantity: 100, unit: 'g', calories: 61, category: 'Dairy' },
      { name: 'Butter', quantity: 10, unit: 'g', calories: 72, category: 'Dairy' },
      { name: 'Ghee', quantity: 1, unit: 'tbsp', calories: 116, category: 'Dairy' },
      { name: 'Cheese (Cheddar)', quantity: 28, unit: 'g', calories: 113, category: 'Dairy' },
      { name: 'Cream Cheese', quantity: 28, unit: 'g', calories: 99, category: 'Dairy' },
    ],
    oils: [
      { name: 'Olive Oil', quantity: 1, unit: 'tbsp', calories: 119, category: 'Oils & Fats' },
      { name: 'Coconut Oil', quantity: 1, unit: 'tbsp', calories: 121, category: 'Oils & Fats' },
      { name: 'Sesame Oil', quantity: 1, unit: 'tbsp', calories: 120, category: 'Oils & Fats' },
      { name: 'Mustard Oil', quantity: 1, unit: 'tbsp', calories: 124, category: 'Oils & Fats' },
      { name: 'Sunflower Oil', quantity: 1, unit: 'tbsp', calories: 120, category: 'Oils & Fats' },
      { name: 'Peanut Butter', quantity: 2, unit: 'tbsp', calories: 188, category: 'Oils & Fats' },
      { name: 'Almond Butter', quantity: 2, unit: 'tbsp', calories: 196, category: 'Oils & Fats' },
    ],
    beverages: [
      { name: 'Black Coffee', quantity: 1, unit: 'cup', calories: 2, category: 'Beverages' },
      { name: 'Green Tea', quantity: 1, unit: 'cup', calories: 2, category: 'Beverages' },
      { name: 'Black Tea', quantity: 1, unit: 'cup', calories: 2, category: 'Beverages' },
      { name: 'Chai (with milk)', quantity: 1, unit: 'cup', calories: 50, category: 'Beverages' },
      { name: 'Coconut Water', quantity: 240, unit: 'ml', calories: 46, category: 'Beverages' },
      { name: 'Lemon Water', quantity: 240, unit: 'ml', calories: 6, category: 'Beverages' },
      { name: 'Orange Juice', quantity: 240, unit: 'ml', calories: 112, category: 'Beverages' },
      { name: 'Apple Juice', quantity: 240, unit: 'ml', calories: 114, category: 'Beverages' },
      { name: 'Smoothie (Mixed)', quantity: 240, unit: 'ml', calories: 150, category: 'Beverages' },
      { name: 'Protein Shake', quantity: 300, unit: 'ml', calories: 180, category: 'Beverages' },
      { name: 'Buttermilk (Chaas)', quantity: 240, unit: 'ml', calories: 40, category: 'Beverages' },
      { name: 'Lassi', quantity: 240, unit: 'ml', calories: 130, category: 'Beverages' },
    ],
    supplements: [
      { name: 'Fiber Drink', quantity: 1, unit: 'serving', calories: 28, category: 'Supplements' },
      { name: 'BCAA', quantity: 1, unit: 'scoop', calories: 10, category: 'Supplements' },
      { name: 'Creatine', quantity: 5, unit: 'g', calories: 0, category: 'Supplements' },
      { name: 'Pre-Workout', quantity: 1, unit: 'scoop', calories: 15, category: 'Supplements' },
      { name: 'Electrolyte Drink', quantity: 1, unit: 'serving', calories: 20, category: 'Supplements' },
      { name: 'Multivitamin', quantity: 1, unit: 'tab', calories: 5, category: 'Supplements' },
    ],
  };

  // Category labels for filtering
  const categories = [
    { key: 'all', label: 'All Foods', icon: '🍽️' },
    { key: 'proteins', label: 'Proteins', icon: '🥩' },
    { key: 'legumes', label: 'Legumes', icon: '🫘' },
    { key: 'grains', label: 'Grains', icon: '🌾' },
    { key: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { key: 'fruits', label: 'Fruits', icon: '🍎' },
    { key: 'nuts', label: 'Nuts & Seeds', icon: '🥜' },
    { key: 'dairy', label: 'Dairy', icon: '🥛' },
    { key: 'oils', label: 'Oils & Fats', icon: '🫒' },
    { key: 'beverages', label: 'Beverages', icon: '☕' },
    { key: 'supplements', label: 'Supplements', icon: '💊' },
  ];

  // Flatten all foods for searching
  const getAllFoods = () => {
    if (selectedCategory === 'all') {
      return Object.values(foodDatabase).flat();
    }
    return foodDatabase[selectedCategory] || [];
  };

  const allFoods = getAllFoods();

  // Filter foods based on search and category
  const filteredFoods = allFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get total food count
  const totalFoodCount = Object.values(foodDatabase).flat().length;

  // Get current phase config
  const currentPhaseConfig = phases[currentPhase];
  const currentMealTimes = currentPhaseConfig.mealTimes;

  // Calculate calories for selected food
  const getCalories = (food, qty, u) => {
    if (!food) return 0;
    if (u === food.unit) {
      return Math.round((qty / food.quantity) * food.calories);
    }
    return Math.round((qty / food.quantity) * food.calories);
  };

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
    setMealTimeSlot(phases[phase].mealTimes[0]);
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food.name);
    setQuantity(food.quantity);
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
      const selectedFoodData = Object.values(foodDatabase).flat().find(f => f.name === selectedFood);
      const calories = getCalories(selectedFoodData, quantity, unit);

      const mealData = {
        date: selectedDate,
        mealTimeSlot,
        foodItems: [{
          foodName: selectedFood,
          quantity,
          unit,
          calories,
        }],
        calories,
        notes,
        photo: photoPreview,
        phase: currentPhase,
        loggedAt: new Date().toISOString(),
      };

      await logMeal(mealData);

      setSuccess(`Logged ${selectedFood} - ${calories} kcal`);
      setSelectedFood('');
      setQuantity(1);
      setNotes('');
      setPhotoPreview(null);
      setPhotoFile(null);
      setError('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to log meal');
    }
  };

  const getSelectedFoodInfo = () => {
    return Object.values(foodDatabase).flat().find(f => f.name === selectedFood);
  };

  const selectedFoodInfo = getSelectedFoodInfo();
  const caloriesForQuantity = selectedFoodInfo ? getCalories(selectedFoodInfo, quantity, unit) : 0;

  return (
    <div className="food-logging-container">
      {/* Header */}
      <div className="page-header">
        <h1>Food Logging</h1>
        <p>Log your meals across 7 phases (V0-V6) with {totalFoodCount}+ foods from complete database</p>
      </div>

      {/* Phase Selector - Card Style */}
      <div className="phase-selector-section">
        <h3>Select Your Phase</h3>
        <div className="phase-cards">
          {Object.entries(phases).map(([key, phase]) => (
            <div
              key={key}
              className={`phase-card ${currentPhase === key ? 'active' : ''}`}
              onClick={() => handlePhaseChange(key)}
              style={{
                '--phase-color': phase.color,
                borderColor: currentPhase === key ? phase.color : '#e5e7eb',
              }}
            >
              <div className="phase-card-icon">{phase.icon}</div>
              <div className="phase-card-label">{key.toUpperCase()}</div>
              <div className="phase-card-name">{phase.name}</div>
              <div className="phase-card-meals">{phase.mealsPerDay} meals/day</div>
            </div>
          ))}
        </div>
        <div className="phase-info-banner" style={{ backgroundColor: `${currentPhaseConfig.color}15`, borderColor: currentPhaseConfig.color }}>
          <span className="phase-info-icon">{currentPhaseConfig.icon}</span>
          <span className="phase-info-text">
            <strong>{currentPhase.toUpperCase()} - {currentPhaseConfig.name}</strong>: {currentPhaseConfig.description}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Main Form */}
      <div className="card food-logging-form">
        <div className="form-row">
          {/* Date Selector */}
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Meal Time Selector */}
          <div className="form-group">
            <label>Meal Time ({currentMealTimes.length} slots in {currentPhase.toUpperCase()})</label>
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

        {/* Category Filter */}
        <div className="form-group">
          <label>Food Category</label>
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Search & Selection */}
        <div className="form-group">
          <label>Search & Select Food ({filteredFoods.length} items)</label>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search foods... (e.g., Chicken, Rice, Apple)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input"
            />
            {searchQuery && filteredFoods.length > 0 && (
              <div className="food-suggestions">
                {filteredFoods.slice(0, 12).map((food, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div className="suggestion-main">
                      <span className="suggestion-name">{food.name}</span>
                      <span className="suggestion-category">{food.category}</span>
                    </div>
                    <div className="suggestion-info">
                      {food.quantity} {food.unit} = {food.calories} kcal
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && filteredFoods.length === 0 && (
              <div className="food-suggestions">
                <div className="no-results">No foods found matching "{searchQuery}"</div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Food Display */}
        {selectedFood && selectedFoodInfo && (
          <div className="selected-food-card">
            <div className="selected-food-header">
              <strong>{selectedFood}</strong>
              <span className="selected-food-category">{selectedFoodInfo.category}</span>
            </div>
            <p>Base: {selectedFoodInfo.quantity} {selectedFoodInfo.unit} = {selectedFoodInfo.calories} kcal</p>
            <button className="btn btn-sm btn-outline" onClick={() => setSelectedFood('')}>
              Change
            </button>
          </div>
        )}

        {/* Quantity Input */}
        {selectedFood && (
          <div className="form-row quantity-row">
            <div className="form-group">
              <label>Quantity</label>
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
                className="input-field unit-display"
              />
            </div>

            <div className="form-group">
              <label>Calories</label>
              <div className="calories-display">
                <span className="calories-value">{caloriesForQuantity}</span>
                <span className="calories-unit">kcal</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Added oil, salt level, taste notes..."
            className="input-field notes-textarea"
            rows="2"
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>Upload Photo (Optional)</label>
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
            <div className="photo-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="file-input"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="photo-upload-label">
                <span className="upload-icon">📷</span>
                <span>Click to upload photo</span>
              </label>
            </div>
          )}
        </div>

        {/* Log Button */}
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleLogMeal}
          disabled={!selectedFood}
        >
          Log Meal
        </button>
      </div>

      {/* Today's Meals Summary */}
      {meals[selectedDate] && meals[selectedDate].length > 0 && (
        <div className="card meals-summary-card">
          <h3>Today's Logged Meals ({currentPhase.toUpperCase()})</h3>
          <div className="meals-timeline">
            {currentMealTimes.map((time) => {
              const mealAtTime = meals[selectedDate].find(m => m.mealTimeSlot === time);
              return (
                <div key={time} className={`meal-timeline-item ${mealAtTime ? 'logged' : ''}`}>
                  <div className="timeline-time">{time}</div>
                  {mealAtTime ? (
                    <div className="timeline-content">
                      <span className="timeline-food">{mealAtTime.foodItems?.[0]?.foodName || mealAtTime.foodName}</span>
                      <span className="timeline-calories">{mealAtTime.calories} kcal</span>
                    </div>
                  ) : (
                    <div className="timeline-empty">Not logged</div>
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

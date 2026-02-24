import React, { useState, useEffect } from 'react';
import { useRecipeStore } from '../store/recipeStore';
import '../styles/Recipes.css';

const RecipesPage = () => {
  const { recipes, getRecipes, addRecipe, isLoading, error } = useRecipeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    servings: 1,
    prepTime: 0,
    calories: 0,
    dietType: 'balanced',
    cuisine: 'other',
  });

  const dietTypes = [
    { value: 'all', label: 'All Recipes' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'highProtein', label: 'High Protein' },
    { value: 'lowCalorie', label: 'Low Calorie' },
    { value: 'balanced', label: 'Balanced' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'lowestCal', label: 'Lowest Calories' },
    { value: 'quickest', label: 'Quickest' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    getRecipes();
  }, []);

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || recipe.dietType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lowestCal':
          return a.calories - b.calories;
        case 'quickest':
          return a.prepTime - b.prepTime;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.likes - a.likes;
      }
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleUploadRecipe = async () => {
    if (!formData.title || !formData.ingredients || !formData.instructions) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      const newRecipe = {
        ...formData,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        instructions: formData.instructions.split('\n').filter(i => i.trim()),
        createdAt: new Date().toISOString(),
        rating: 0,
        likes: 0,
        reviews: [],
      };

      await addRecipe(newRecipe);
      setSuccess('Recipe uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        servings: 1,
        prepTime: 0,
        calories: 0,
        dietType: 'balanced',
        cuisine: 'other',
      });
      setShowUploadForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to upload recipe');
    }
  };

  const handleAddToMealPlan = (recipe) => {
    alert(`Added "${recipe.title}" to your meal plan!`);
  };

  const handleSaveRecipe = (recipe) => {
    alert(`Saved "${recipe.title}" to your favorites!`);
  };

  return (
    <div className="recipes-container">
      {/* Header */}
      <div className="page-header">
        <h1>Recipes & Community</h1>
        <p>Discover healthy recipes shared by our community</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {localError && <div className="alert alert-danger">{localError}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Upload Button */}
      <div className="recipe-header-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '+ Share Recipe'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="card upload-form">
          <h3>Share Your Recipe</h3>

          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Grilled Chicken Salad"
              className="input-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Diet Type</label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="highProtein">High Protein</option>
                <option value="lowCalorie">Low Calorie</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cuisine</label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
                placeholder="e.g., Italian"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your recipe..."
              className="input-field"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                min="1"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                min="0"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Calories per Serving</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                min="0"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients * (one per line)</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="2 chicken breasts&#10;1 cup spinach&#10;1 tbsp olive oil"
              className="input-field"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Instructions * (one step per line)</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Heat olive oil in pan&#10;Add chicken and cook for 6 minutes per side&#10;Top with fresh spinach"
              className="input-field"
              rows="5"
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleUploadRecipe}
          >
            Publish Recipe
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="recipes-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {dietTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedRecipe(null)}
            >
              X
            </button>

            <h2>{selectedRecipe.title}</h2>
            <p className="recipe-meta">
              By {selectedRecipe.author} | {selectedRecipe.prepTime} min | {selectedRecipe.calories} kcal
            </p>

            <div className="recipe-stats">
              <div className="stat">
                <span className="stat-icon">*</span>
                <span>{selectedRecipe.rating.toFixed(1)}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">L</span>
                <span>{selectedRecipe.likes}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">C</span>
                <span>{selectedRecipe.reviews?.length || 0}</span>
              </div>
            </div>

            <div className="recipe-section">
              <h4>Ingredients ({selectedRecipe.ingredients.length})</h4>
              <ul className="ingredients-list">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-section">
              <h4>Instructions</h4>
              <ol className="instructions-list">
                {selectedRecipe.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="recipe-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleAddToMealPlan(selectedRecipe)}
              >
                Add to Meal Plan
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleSaveRecipe(selectedRecipe)}
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipes Grid */}
      <div className="recipes-grid">
        {filteredAndSortedRecipes.length > 0 ? (
          filteredAndSortedRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="recipe-image">
                <div className="image-placeholder">Recipe</div>
                <div className="recipe-badge">{recipe.dietType}</div>
              </div>

              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <p className="recipe-author">by {recipe.author}</p>
                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-info">
                  <span>{recipe.prepTime}m</span>
                  <span>{recipe.calories} kcal</span>
                  <span>{recipe.servings} servings</span>
                </div>

                <div className="recipe-footer">
                  <div className="recipe-rating">
                    <span className="stars">* {recipe.rating.toFixed(1)}</span>
                    <span className="likes">L {recipe.likes}</span>
                  </div>
                  <button className="btn-heart" onClick={(e) => {
                    e.stopPropagation();
                    handleSaveRecipe(recipe);
                  }}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No recipes found</p>
            <p className="hint">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;

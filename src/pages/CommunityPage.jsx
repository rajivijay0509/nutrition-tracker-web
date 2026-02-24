import React, { useState, useEffect } from 'react';
import { useCommunityStore } from '../store/communityStore';
import { useRecipeStore } from '../store/recipeStore';
import '../styles/Community.css';

const CommunityPage = () => {
  const {
    communityRecipes,
    getCommunityRecipes,
    rateRecipe,
    shareRecipe,
    saveRecipe,
    searchRecipes,
    isLoading,
    error
  } = useCommunityStore();

  const { addRecipe } = useRecipeStore();

  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [sharedRecipes, setSharedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

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
    isPublic: true,
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
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'lowestCal', label: 'Lowest Calories' },
    { value: 'quickest', label: 'Quickest' },
    { value: 'topRated', label: 'Top Rated' },
  ];

  useEffect(() => {
    getCommunityRecipes();
  }, []);

  // Filter and sort recipes
  const filteredRecipes = communityRecipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.author.toLowerCase().includes(searchQuery.toLowerCase());
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
        case 'topRated':
          return b.rating - a.rating;
        case 'popular':
          return b.shares - a.shares;
        case 'trending':
        default:
          return (b.likes + b.ratings.length * 10) - (a.likes + a.ratings.length * 10);
      }
    });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setLocalError('');
  };

  const handleUploadRecipe = async () => {
    if (!formData.title || !formData.ingredients || !formData.instructions) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      const newRecipe = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        instructions: formData.instructions.split('\n').filter(i => i.trim()),
        servings: parseInt(formData.servings),
        prepTime: parseInt(formData.prepTime),
        calories: parseInt(formData.calories),
        dietType: formData.dietType,
        cuisine: formData.cuisine,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        author: 'Current User',
        rating: 0,
        likes: 0,
        shares: 0,
        ratings: [],
        comments: [],
      };

      await addRecipe(newRecipe);
      setSuccess('Recipe shared successfully with community!');
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
        isPublic: true,
      });
      setShowUploadForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to share recipe');
    }
  };

  const handleRateRecipe = async () => {
    if (userRating === 0) {
      setLocalError('Please select a rating');
      return;
    }

    try {
      await rateRecipe(selectedRecipe.id, userRating, ratingComment);
      setSuccess('Thank you for rating!');
      setUserRating(0);
      setRatingComment('');
      const updated = communityRecipes.find(r => r.id === selectedRecipe.id);
      setSelectedRecipe(updated);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to submit rating');
    }
  };

  const handleShareRecipe = async (recipe) => {
    try {
      await shareRecipe(recipe.id);
      setSharedRecipes([...sharedRecipes, recipe.id]);
      setSuccess(`"${recipe.title}" shared to your followers!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to share recipe');
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await saveRecipe(recipe.id);
      setSavedRecipes([...savedRecipes, recipe.id]);
      setSuccess(`"${recipe.title}" saved to your favorites!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError('Failed to save recipe');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchRecipes(query);
    }
  };

  const getAverageRating = (recipe) => {
    if (!recipe.ratings || recipe.ratings.length === 0) return 0;
    const sum = recipe.ratings.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / recipe.ratings.length).toFixed(1);
  };

  return (
    <div className="community-container">
      {/* Header */}
      <div className="page-header">
        <h1>Community Recipes</h1>
        <p>Discover, rate, and share healthy recipes with our community</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {localError && <div className="alert alert-danger">{localError}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="community-tabs">
        <button
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
        <button
          className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`tab-btn ${activeTab === 'myShared' ? 'active' : ''}`}
          onClick={() => setActiveTab('myShared')}
        >
          My Shared
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
      </div>

      {/* Content */}
      <div className="community-content">
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <>
            {/* Share Recipe Button */}
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
                <h3>Share Your Recipe with Community</h3>

                <div className="form-group">
                  <label>Recipe Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Delicious High-Protein Grilled Chicken Salad"
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
                      placeholder="e.g., Mediterranean"
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
                    placeholder="Tell the community why you love this recipe..."
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
                    placeholder="Heat olive oil in pan&#10;Add chicken and cook for 6 minutes per side"
                    className="input-field"
                    rows="5"
                  />
                </div>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  <span>Make this recipe public (visible to all community members)</span>
                </label>

                <button
                  className="btn btn-primary btn-block"
                  onClick={handleUploadRecipe}
                >
                  Share Recipe with Community
                </button>
              </div>
            )}

            {/* Search & Filters */}
            <div className="recipes-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search recipes by name, ingredient, or author..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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

            {/* Recipes Grid */}
            <div className="recipes-grid">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="recipe-card community-recipe-card"
                  >
                    <div className="recipe-image">
                      <div className="image-placeholder">Chef</div>
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

                      <div className="recipe-stats-bar">
                        <div className="stat-badge">
                          <span>Rating: {getAverageRating(recipe)}</span>
                          <span className="stat-count">({recipe.ratings?.length || 0})</span>
                        </div>
                        <div className="stat-badge">
                          <span>Likes: {recipe.likes}</span>
                        </div>
                        <div className="stat-badge">
                          <span>Shares: {recipe.shares || 0}</span>
                        </div>
                      </div>

                      <div className="recipe-footer">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          View & Rate
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleSaveRecipe(recipe)}
                          disabled={savedRecipes.includes(recipe.id)}
                        >
                          {savedRecipes.includes(recipe.id) ? 'Saved' : 'Save'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleShareRecipe(recipe)}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recipes found</p>
                  <p className="hint">Try different search terms or filters</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Recipe Detail Modal */}
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
                by {selectedRecipe.author} | {selectedRecipe.prepTime} min | {selectedRecipe.calories} kcal
              </p>

              <div className="recipe-stats">
                <div className="stat">
                  <span className="stat-icon">Rating</span>
                  <span>{getAverageRating(selectedRecipe)}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">Likes</span>
                  <span>{selectedRecipe.likes}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">Reviews</span>
                  <span>{selectedRecipe.ratings?.length || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">Shares</span>
                  <span>{selectedRecipe.shares || 0}</span>
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

              {/* Rating Section */}
              <div className="recipe-section">
                <h4>Rate This Recipe</h4>
                <div className="rating-input">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`star ${userRating >= star ? 'active' : ''}`}
                        onClick={() => setUserRating(star)}
                      >
                        *
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share what you think about this recipe..."
                  className="input-field"
                  rows="3"
                />

                <button
                  className="btn btn-primary"
                  onClick={handleRateRecipe}
                  disabled={userRating === 0}
                >
                  Submit Rating
                </button>
              </div>

              {/* Recent Ratings */}
              {selectedRecipe.ratings && selectedRecipe.ratings.length > 0 && (
                <div className="recipe-section">
                  <h4>Community Ratings</h4>
                  <div className="ratings-list">
                    {selectedRecipe.ratings.slice(0, 5).map((rating, idx) => (
                      <div key={idx} className="rating-item">
                        <div className="rating-header">
                          <strong>{rating.userName}</strong>
                          <span className="rating-stars">{'*'.repeat(rating.score)}</span>
                        </div>
                        <p className="rating-comment">{rating.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="recipe-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSaveRecipe(selectedRecipe)}
                  disabled={savedRecipes.includes(selectedRecipe.id)}
                >
                  {savedRecipes.includes(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleShareRecipe(selectedRecipe)}
                >
                  Share with Followers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="trending-section">
            <h3>Trending This Week</h3>
            <div className="recipes-grid">
              {filteredRecipes.slice(0, 12).map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-image">
                    <div className="image-placeholder">Chef</div>
                  </div>
                  <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-author">by {recipe.author}</p>
                    <div className="recipe-footer">
                      <button className="btn btn-sm btn-primary" onClick={() => setSelectedRecipe(recipe)}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Shared Tab */}
        {activeTab === 'myShared' && (
          <div className="my-recipes-section">
            <h3>Recipes I've Shared</h3>
            <p className="section-description">Manage and track your shared recipes</p>
            <div className="empty-state">
              <p>You haven't shared any recipes yet</p>
              <p className="hint">Share a recipe above to get started!</p>
            </div>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="saved-recipes-section">
            <h3>My Favorite Recipes</h3>
            <p className="section-description">Recipes you've saved for later</p>
            {savedRecipes.length > 0 ? (
              <div className="recipes-grid">
                {communityRecipes
                  .filter(r => savedRecipes.includes(r.id))
                  .map(recipe => (
                    <div key={recipe.id} className="recipe-card">
                      <div className="recipe-image">
                        <div className="image-placeholder">Chef</div>
                      </div>
                      <div className="recipe-content">
                        <h3>{recipe.title}</h3>
                        <p className="recipe-author">by {recipe.author}</p>
                        <div className="recipe-footer">
                          <button className="btn btn-sm btn-primary" onClick={() => setSelectedRecipe(recipe)}>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No saved recipes yet</p>
                <p className="hint">Save recipes from the discover section to see them here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;

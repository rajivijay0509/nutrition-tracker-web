import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCommunityStore = create(
  persist(
    (set, get) => ({
      communityRecipes: [
        {
          id: 1,
          title: 'Grilled Chicken Salad with Avocado',
          description: 'A healthy high-protein salad with grilled chicken breast and creamy avocado.',
          author: 'Sarah Johnson',
          ingredients: ['2 chicken breasts', '4 cups mixed greens', '1 avocado', '2 tomatoes', '1 cucumber', '2 tbsp olive oil'],
          instructions: ['Grill chicken', 'Slice chicken', 'Arrange greens', 'Top with vegetables', 'Drizzle with dressing'],
          servings: 2,
          prepTime: 20,
          calories: 320,
          dietType: 'highProtein',
          cuisine: 'Mediterranean',
          rating: 4.8,
          likes: 234,
          shares: 45,
          isPublic: true,
          ratings: [
            { userId: 1, userName: 'Mike', score: 5, comment: 'Absolutely delicious!' },
            { userId: 2, userName: 'Emma', score: 5, comment: 'My new favorite!' },
          ],
          comments: [],
          createdAt: '2024-02-15',
        },
        {
          id: 2,
          title: 'Vegan Buddha Bowl',
          description: 'Colorful and nutritious vegan bowl with quinoa and roasted vegetables.',
          author: 'Mike Chen',
          ingredients: ['1 cup quinoa', '2 cups broccoli', '1 sweet potato', '1 bell pepper', '2 tbsp tahini'],
          instructions: ['Cook quinoa', 'Roast vegetables', 'Assemble bowl', 'Drizzle with tahini'],
          servings: 1,
          prepTime: 30,
          calories: 450,
          dietType: 'vegan',
          cuisine: 'Asian',
          rating: 4.6,
          likes: 189,
          shares: 32,
          isPublic: true,
          ratings: [],
          comments: [],
          createdAt: '2024-02-14',
        },
        {
          id: 3,
          title: 'Low-Calorie Green Soup',
          description: 'Light and refreshing green vegetable soup perfect for weight loss.',
          author: 'Emma Lee',
          ingredients: ['2 cups spinach', '1 cup broccoli', '1 onion', '2 cloves garlic', '4 cups broth'],
          instructions: ['Saute onions and garlic', 'Add vegetables', 'Simmer 15 minutes', 'Blend until smooth'],
          servings: 4,
          prepTime: 25,
          calories: 95,
          dietType: 'lowCalorie',
          cuisine: 'American',
          rating: 4.7,
          likes: 256,
          shares: 78,
          isPublic: true,
          ratings: [
            { userId: 3, userName: 'John', score: 5, comment: 'Great for dieting!' },
          ],
          comments: [],
          createdAt: '2024-02-13',
        },
      ],
      isLoading: false,
      error: null,
      searchResults: [],

      // Get all community recipes
      getCommunityRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch community recipes',
            isLoading: false,
          });
        }
      },

      // Share recipe to community
      shareRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            communityRecipes: state.communityRecipes.map(r =>
              r.id === recipeId ? { ...r, shares: r.shares + 1 } : r
            ),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to share recipe',
            isLoading: false,
          });
          return false;
        }
      },

      // Rate recipe
      rateRecipe: async (recipeId, score, comment) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            communityRecipes: state.communityRecipes.map(r => {
              if (r.id === recipeId) {
                const newRatings = [...(r.ratings || []), { score, comment, userName: 'You' }];
                const avgRating = newRatings.reduce((sum, rating) => sum + rating.score, 0) / newRatings.length;
                return { ...r, ratings: newRatings, rating: avgRating };
              }
              return r;
            }),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to rate recipe',
            isLoading: false,
          });
          return false;
        }
      },

      // Save recipe to favorites
      saveRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to save recipe',
            isLoading: false,
          });
          return false;
        }
      },

      // Like recipe
      likeRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            communityRecipes: state.communityRecipes.map(r =>
              r.id === recipeId ? { ...r, likes: r.likes + 1 } : r
            ),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to like recipe',
            isLoading: false,
          });
          return false;
        }
      },

      // Search recipes
      searchRecipes: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const filtered = get().communityRecipes.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase()) ||
            r.author.toLowerCase().includes(query.toLowerCase()) ||
            r.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase()))
          );
          set({ searchResults: filtered, isLoading: false });
          return filtered;
        } catch (error) {
          set({
            error: error.message || 'Failed to search recipes',
            isLoading: false,
          });
          return [];
        }
      },

      // Get trending recipes
      getTrendingRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
          const trending = get().communityRecipes
            .sort((a, b) => (b.likes + b.shares + (b.ratings?.length || 0) * 5) - (a.likes + a.shares + (a.ratings?.length || 0) * 5))
            .slice(0, 12);
          set({ isLoading: false });
          return trending;
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch trending recipes',
            isLoading: false,
          });
          return [];
        }
      },

      // Get top rated recipes
      getTopRatedRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
          const topRated = get().communityRecipes
            .filter(r => (r.ratings?.length || 0) > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 12);
          set({ isLoading: false });
          return topRated;
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch top rated recipes',
            isLoading: false,
          });
          return [];
        }
      },

      // Comment on recipe
      commentOnRecipe: async (recipeId, comment) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            communityRecipes: state.communityRecipes.map(r =>
              r.id === recipeId
                ? { ...r, comments: [...(r.comments || []), { userName: 'You', text: comment, createdAt: new Date() }] }
                : r
            ),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to post comment',
            isLoading: false,
          });
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'community-storage',
      partialize: (state) => ({ communityRecipes: state.communityRecipes }),
    }
  )
);

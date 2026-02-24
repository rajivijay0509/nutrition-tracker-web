import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [
        {
          id: 1,
          title: 'Grilled Chicken Salad',
          description: 'A healthy grilled chicken served with fresh mixed greens and light vinaigrette.',
          author: 'Sarah Johnson',
          ingredients: ['2 chicken breasts', '4 cups mixed greens', '1 cucumber', '2 tomatoes', '2 tbsp olive oil', '1 tbsp balsamic vinegar'],
          instructions: ['Grill chicken until cooked', 'Slice chicken into strips', 'Toss greens and vegetables', 'Add chicken on top', 'Drizzle with dressing'],
          servings: 2,
          prepTime: 20,
          calories: 320,
          dietType: 'highProtein',
          cuisine: 'Mediterranean',
          rating: 4.8,
          likes: 234,
          reviews: [],
          createdAt: '2024-02-15',
        },
        {
          id: 2,
          title: 'Vegetable Stir Fry',
          description: 'Colorful mix of fresh vegetables with garlic and ginger.',
          author: 'Mike Chen',
          ingredients: ['2 cups broccoli', '1 bell pepper', '1 carrot', '2 cloves garlic', '1 tbsp soy sauce', '1 tsp ginger'],
          instructions: ['Chop all vegetables', 'Heat wok over high heat', 'Stir fry vegetables', 'Add soy sauce and ginger', 'Serve hot'],
          servings: 3,
          prepTime: 15,
          calories: 180,
          dietType: 'vegan',
          cuisine: 'Asian',
          rating: 4.5,
          likes: 189,
          reviews: [],
          createdAt: '2024-02-14',
        },
        {
          id: 3,
          title: 'Protein Smoothie Bowl',
          description: 'Delicious protein-packed smoothie bowl with granola and berries.',
          author: 'Emma Lee',
          ingredients: ['1 cup Greek yogurt', '1 banana', '1 cup berries', '1 tbsp honey', '1/4 cup granola', '1/4 cup coconut'],
          instructions: ['Blend yogurt and berries', 'Pour into bowl', 'Top with granola and coconut', 'Add honey drizzle'],
          servings: 1,
          prepTime: 5,
          calories: 380,
          dietType: 'balanced',
          cuisine: 'American',
          rating: 4.9,
          likes: 456,
          reviews: [],
          createdAt: '2024-02-13',
        },
      ],
      isLoading: false,
      error: null,

      // Get all recipes
      getRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
          // For now using mock data above
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch recipes',
            isLoading: false,
          });
        }
      },

      // Add new recipe
      addRecipe: async (recipeData) => {
        set({ isLoading: true, error: null });
        try {
          const newRecipe = {
            ...recipeData,
            id: Date.now(),
            author: 'Current User',
            rating: 0,
            likes: 0,
            reviews: [],
            createdAt: new Date().toISOString().split('T')[0],
          };

          set(state => ({
            recipes: [newRecipe, ...state.recipes],
            isLoading: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error.message || 'Failed to add recipe',
            isLoading: false,
          });
          return false;
        }
      },

      // Get single recipe with reviews
      getRecipeDetails: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
          const recipe = get().recipes.find(r => r.id === recipeId);
          set({ isLoading: false });
          return recipe;
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch recipe details',
            isLoading: false,
          });
          return null;
        }
      },

      // Rate recipe
      rateRecipe: async (recipeId, rating) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            recipes: state.recipes.map(r =>
              r.id === recipeId
                ? { ...r, rating: parseFloat(((r.rating * 10 + rating) / 11).toFixed(1)) }
                : r
            ),
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

      // Like recipe
      likeRecipe: async (recipeId) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            recipes: state.recipes.map(r =>
              r.id === recipeId
                ? { ...r, likes: r.likes + 1 }
                : r
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

      // Search recipes
      searchRecipes: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const filtered = get().recipes.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase())
          );
          set({ isLoading: false });
          return filtered;
        } catch (error) {
          set({
            error: error.message || 'Failed to search recipes',
            isLoading: false,
          });
          return [];
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'recipes-storage',
      partialize: (state) => ({ recipes: state.recipes }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useFoodStore = create(
  persist(
    (set, get) => ({
      meals: {},
      selectedDate: new Date().toISOString().split('T')[0],
      isLoading: false,
      error: null,

      // Set selected date
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Log meal
      logMeal: async (mealData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { date, mealTimeSlot, foodItems, notes, photo } = mealData;

          // Calculate total calories for the meal
          const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);

          const mealRecord = {
            user_id: user.id,
            date,
            meal_time_slot: mealTimeSlot,
            food_items: foodItems,
            calories: totalCalories,
            notes: notes || null,
            photo: photo || null,
            created_at: new Date().toISOString(),
          };

          // Try to insert into Supabase
          const { data, error } = await supabase
            .from('meals')
            .insert(mealRecord)
            .select()
            .single();

          if (error) {
            // If table doesn't exist or other Supabase error, fall back to local storage
            console.warn('Supabase insert failed, using local storage:', error.message);
            const localMeal = {
              id: Date.now().toString(),
              ...mealRecord,
              mealTimeSlot,
              foodItems,
            };

            set((state) => {
              const existingMeals = state.meals[date] || [];
              return {
                meals: {
                  ...state.meals,
                  [date]: [...existingMeals, localMeal],
                },
                isLoading: false,
              };
            });
            return true;
          }

          // Transform data for consistency
          const savedMeal = {
            id: data.id,
            mealTimeSlot: data.meal_time_slot,
            foodItems: data.food_items,
            calories: data.calories,
            notes: data.notes,
            photo: data.photo,
            date: data.date,
          };

          set((state) => {
            const existingMeals = state.meals[date] || [];
            return {
              meals: {
                ...state.meals,
                [date]: [...existingMeals, savedMeal],
              },
              isLoading: false,
            };
          });
          return true;
        } catch (error) {
          console.error('Log meal error:', error);
          set({ error: error.message || 'Failed to log meal', isLoading: false });
          return false;
        }
      },

      // Get daily meals
      getDailyMeals: async (date) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            // Return local meals if not authenticated
            const localMeals = get().meals[date] || [];
            set({ isLoading: false });
            return localMeals;
          }

          const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', date)
            .order('created_at', { ascending: true });

          if (error) {
            console.warn('Supabase fetch failed, using local storage:', error.message);
            const localMeals = get().meals[date] || [];
            set({ isLoading: false });
            return localMeals;
          }

          // Transform data for consistency
          const meals = (data || []).map(meal => ({
            id: meal.id,
            mealTimeSlot: meal.meal_time_slot,
            foodItems: meal.food_items,
            calories: meal.calories,
            notes: meal.notes,
            photo: meal.photo,
            date: meal.date,
          }));

          set((state) => ({
            meals: {
              ...state.meals,
              [date]: meals,
            },
            isLoading: false,
          }));
          return meals;
        } catch (error) {
          console.error('Get meals error:', error);
          set({ isLoading: false });
          return get().meals[date] || [];
        }
      },

      // Delete meal
      deleteMeal: async (mealId, date) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { error } = await supabase
              .from('meals')
              .delete()
              .eq('id', mealId)
              .eq('user_id', user.id);

            if (error) {
              console.warn('Supabase delete failed:', error.message);
            }
          }

          // Always update local state
          set((state) => ({
            meals: {
              ...state.meals,
              [date]: (state.meals[date] || []).filter(m => m.id !== mealId),
            },
          }));
          return true;
        } catch (error) {
          console.error('Delete meal error:', error);
          set({ error: 'Failed to delete meal' });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'food-storage',
      partialize: (state) => ({ meals: state.meals }),
    }
  )
);

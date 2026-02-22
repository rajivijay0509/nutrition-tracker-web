import { create } from 'zustand';
import api from '../api/client';

export const useFoodStore = create((set) => ({
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
      const response = await api.post('/meals/log', mealData);
      const { date } = mealData;
      
      set((state) => ({
        meals: {
          ...state.meals,
          [date]: response.data,
        },
        isLoading: false,
      }));
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to log meal';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  // Upload meal photo
  uploadMealPhoto: async (mealId, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post(`/meals/${mealId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Photo upload failed';
      set({ error: errorMsg, isLoading: false });
      return null;
    }
  },

  // Get daily meals
  getDailyMeals: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/meals/${date}`);
      
      set((state) => ({
        meals: {
          ...state.meals,
          [date]: response.data,
        },
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  // Delete meal
  deleteMeal: async (mealId, date) => {
    try {
      await api.delete(`/meals/${mealId}`);
      
      set((state) => ({
        meals: {
          ...state.meals,
          [date]: state.meals[date]?.filter(m => m.id !== mealId),
        },
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to delete meal' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

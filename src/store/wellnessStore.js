import { create } from 'zustand';
import api from '../api/client';

export const useWellnessStore = create((set) => ({
  wellness: {},
  symptoms: [],
  isLoading: false,
  error: null,

  // Log daily wellness
  logWellness: async (wellnessData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/wellness/daily', wellnessData);
      const { date } = wellnessData;
      
      set((state) => ({
        wellness: {
          ...state.wellness,
          [date]: response.data,
        },
        isLoading: false,
      }));
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to log wellness';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  // Log symptom
  logSymptom: async (symptomData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/symptoms', symptomData);
      
      set((state) => ({
        symptoms: [...state.symptoms, response.data],
        isLoading: false,
      }));
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to log symptom';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  // Get wellness for date
  getWellness: async (date) => {
    try {
      const response = await api.get(`/wellness/${date}`);
      
      set((state) => ({
        wellness: {
          ...state.wellness,
          [date]: response.data,
        },
      }));
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Get symptoms for date range
  getSymptoms: async (startDate, endDate) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/symptoms', {
        params: { startDate, endDate },
      });
      
      set({ symptoms: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  // Delete symptom
  deleteSymptom: async (symptomId) => {
    try {
      await api.delete(`/symptoms/${symptomId}`);
      
      set((state) => ({
        symptoms: state.symptoms.filter(s => s.id !== symptomId),
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to delete symptom' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

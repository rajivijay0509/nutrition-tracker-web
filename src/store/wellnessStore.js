import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useWellnessStore = create(
  persist(
    (set, get) => ({
      wellness: {},
      symptoms: [],
      isLoading: false,
      error: null,

      // Log daily wellness
      logWellness: async (wellnessData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const {
            date, moodEmoji, energyLevel, sleepHours, exerciseMinutes, activityLevel, notes,
            weight, fastingGlucose, afterFoodGlucose, bpSystolic, bpDiastolic, supplements
          } = wellnessData;

          const wellnessRecord = {
            user_id: user.id,
            date,
            mood_emoji: moodEmoji,
            energy_level: energyLevel,
            sleep_hours: sleepHours,
            exercise_minutes: exerciseMinutes,
            activity_level: activityLevel,
            notes: notes || null,
            weight: weight || null,
            fasting_glucose: fastingGlucose || null,
            after_food_glucose: afterFoodGlucose || null,
            bp_systolic: bpSystolic || null,
            bp_diastolic: bpDiastolic || null,
            supplements: supplements || [],
            updated_at: new Date().toISOString(),
          };

          // Try to upsert into Supabase
          const { data, error } = await supabase
            .from('wellness')
            .upsert(wellnessRecord, { onConflict: 'user_id,date' })
            .select()
            .single();

          if (error) {
            // Fall back to local storage
            console.warn('Supabase upsert failed, using local storage:', error.message);
            const localWellness = {
              id: Date.now().toString(),
              ...wellnessData,
            };

            set((state) => ({
              wellness: {
                ...state.wellness,
                [date]: localWellness,
              },
              isLoading: false,
            }));
            return true;
          }

          // Transform data for consistency
          const savedWellness = {
            id: data.id,
            moodEmoji: data.mood_emoji,
            energyLevel: data.energy_level,
            sleepHours: data.sleep_hours,
            exerciseMinutes: data.exercise_minutes,
            activityLevel: data.activity_level,
            notes: data.notes,
            date: data.date,
            weight: data.weight,
            fastingGlucose: data.fasting_glucose,
            afterFoodGlucose: data.after_food_glucose,
            bpSystolic: data.bp_systolic,
            bpDiastolic: data.bp_diastolic,
            supplements: data.supplements || [],
          };

          set((state) => ({
            wellness: {
              ...state.wellness,
              [date]: savedWellness,
            },
            isLoading: false,
          }));
          return true;
        } catch (error) {
          console.error('Log wellness error:', error);
          set({ error: error.message || 'Failed to log wellness', isLoading: false });
          return false;
        }
      },

      // Log symptom
      logSymptom: async (symptomData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { date, symptomType, severity, description } = symptomData;

          const symptomRecord = {
            user_id: user.id,
            date,
            symptom_type: symptomType,
            severity,
            description: description || null,
            created_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('symptoms')
            .insert(symptomRecord)
            .select()
            .single();

          if (error) {
            console.warn('Supabase insert failed, using local storage:', error.message);
            const localSymptom = {
              id: Date.now().toString(),
              ...symptomData,
            };

            set((state) => ({
              symptoms: [...state.symptoms, localSymptom],
              isLoading: false,
            }));
            return true;
          }

          const savedSymptom = {
            id: data.id,
            symptomType: data.symptom_type,
            severity: data.severity,
            description: data.description,
            date: data.date,
          };

          set((state) => ({
            symptoms: [...state.symptoms, savedSymptom],
            isLoading: false,
          }));
          return true;
        } catch (error) {
          console.error('Log symptom error:', error);
          set({ error: error.message || 'Failed to log symptom', isLoading: false });
          return false;
        }
      },

      // Get wellness for date
      getWellness: async (date) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            return get().wellness[date] || null;
          }

          const { data, error } = await supabase
            .from('wellness')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', date)
            .single();

          if (error) {
            console.warn('Supabase fetch failed, using local storage:', error.message);
            return get().wellness[date] || null;
          }

          const wellness = data ? {
            id: data.id,
            moodEmoji: data.mood_emoji,
            energyLevel: data.energy_level,
            sleepHours: data.sleep_hours,
            exerciseMinutes: data.exercise_minutes,
            activityLevel: data.activity_level,
            notes: data.notes,
            date: data.date,
            weight: data.weight,
            fastingGlucose: data.fasting_glucose,
            afterFoodGlucose: data.after_food_glucose,
            bpSystolic: data.bp_systolic,
            bpDiastolic: data.bp_diastolic,
            supplements: data.supplements || [],
          } : null;

          if (wellness) {
            set((state) => ({
              wellness: {
                ...state.wellness,
                [date]: wellness,
              },
            }));
          }

          return wellness;
        } catch (error) {
          console.error('Get wellness error:', error);
          return get().wellness[date] || null;
        }
      },

      // Get symptoms for date range
      getSymptoms: async (startDate, endDate) => {
        set({ isLoading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            set({ isLoading: false });
            return get().symptoms;
          }

          const { data, error } = await supabase
            .from('symptoms')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Supabase fetch failed:', error.message);
            set({ isLoading: false });
            return get().symptoms;
          }

          const symptoms = (data || []).map(s => ({
            id: s.id,
            symptomType: s.symptom_type,
            severity: s.severity,
            description: s.description,
            date: s.date,
          }));

          set({ symptoms, isLoading: false });
          return symptoms;
        } catch (error) {
          console.error('Get symptoms error:', error);
          set({ isLoading: false });
          return get().symptoms;
        }
      },

      // Delete symptom
      deleteSymptom: async (symptomId) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { error } = await supabase
              .from('symptoms')
              .delete()
              .eq('id', symptomId)
              .eq('user_id', user.id);

            if (error) {
              console.warn('Supabase delete failed:', error.message);
            }
          }

          set((state) => ({
            symptoms: state.symptoms.filter(s => s.id !== symptomId),
          }));
          return true;
        } catch (error) {
          console.error('Delete symptom error:', error);
          set({ error: 'Failed to delete symptom' });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wellness-storage',
      partialize: (state) => ({ wellness: state.wellness, symptoms: state.symptoms }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],
      isLoading: false,
      error: null,

      // Get all goals
      getGoals: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            set({ isLoading: false });
            return get().goals;
          }

          const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Supabase fetch failed, using local storage:', error.message);
            set({ isLoading: false });
            return get().goals;
          }

          const goals = (data || []).map(goal => ({
            id: goal.id,
            name: goal.name,
            goalType: goal.goal_type,
            targetValue: goal.target_value,
            currentValue: goal.current_value || 0,
            unit: goal.unit,
            category: goal.category,
            description: goal.description,
            startDate: goal.start_date,
            endDate: goal.end_date,
            status: goal.status,
            createdAt: goal.created_at,
          }));

          set({ goals, isLoading: false });
          return goals;
        } catch (error) {
          console.error('Get goals error:', error);
          set({ isLoading: false });
          return get().goals;
        }
      },

      // Add new goal
      addGoal: async (goalData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          const goalTypes = {
            calories: 'kcal',
            sleep: 'hours',
            exercise: 'minutes',
            water: 'glasses',
            steps: 'steps',
            weight: 'kg',
          };

          const goalRecord = {
            user_id: user?.id,
            name: goalData.name,
            goal_type: goalData.goalType,
            target_value: goalData.targetValue,
            current_value: goalData.currentValue || 0,
            unit: goalTypes[goalData.goalType] || 'units',
            category: goalData.category,
            description: goalData.description || null,
            start_date: goalData.startDate,
            end_date: goalData.endDate || null,
            status: goalData.status || 'active',
            created_at: new Date().toISOString(),
          };

          if (user) {
            const { data, error } = await supabase
              .from('goals')
              .insert(goalRecord)
              .select()
              .single();

            if (!error && data) {
              const newGoal = {
                id: data.id,
                name: data.name,
                goalType: data.goal_type,
                targetValue: data.target_value,
                currentValue: data.current_value,
                unit: data.unit,
                category: data.category,
                description: data.description,
                startDate: data.start_date,
                endDate: data.end_date,
                status: data.status,
                createdAt: data.created_at,
              };

              set(state => ({
                goals: [newGoal, ...state.goals],
                isLoading: false,
              }));
              return true;
            }
          }

          // Fallback to local storage
          const localGoal = {
            id: Date.now().toString(),
            ...goalData,
            unit: goalTypes[goalData.goalType] || 'units',
          };

          set(state => ({
            goals: [localGoal, ...state.goals],
            isLoading: false,
          }));
          return true;
        } catch (error) {
          console.error('Add goal error:', error);
          set({ error: error.message || 'Failed to add goal', isLoading: false });
          return false;
        }
      },

      // Update goal
      updateGoal: async (goalId, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const updateData = {};
            if (updates.currentValue !== undefined) updateData.current_value = updates.currentValue;
            if (updates.targetValue !== undefined) updateData.target_value = updates.targetValue;
            if (updates.status !== undefined) updateData.status = updates.status;
            if (updates.name !== undefined) updateData.name = updates.name;
            if (updates.description !== undefined) updateData.description = updates.description;

            const { error } = await supabase
              .from('goals')
              .update(updateData)
              .eq('id', goalId)
              .eq('user_id', user.id);

            if (error) {
              console.warn('Supabase update failed:', error.message);
            }
          }

          // Update local state
          set(state => ({
            goals: state.goals.map(g =>
              g.id === goalId ? { ...g, ...updates } : g
            ),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          console.error('Update goal error:', error);
          set({ error: error.message || 'Failed to update goal', isLoading: false });
          return false;
        }
      },

      // Delete goal
      deleteGoal: async (goalId) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { error } = await supabase
              .from('goals')
              .delete()
              .eq('id', goalId)
              .eq('user_id', user.id);

            if (error) {
              console.warn('Supabase delete failed:', error.message);
            }
          }

          set(state => ({
            goals: state.goals.filter(g => g.id !== goalId),
          }));
          return true;
        } catch (error) {
          console.error('Delete goal error:', error);
          set({ error: 'Failed to delete goal' });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'goals-storage',
      partialize: (state) => ({ goals: state.goals }),
    }
  )
);

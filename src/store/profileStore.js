import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      // Get user profile
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            set({ isLoading: false });
            return get().profile;
          }

          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            // If profile doesn't exist, create default
            if (error.code === 'PGRST116') {
              const defaultProfile = {
                firstName: user.user_metadata?.first_name || '',
                lastName: user.user_metadata?.last_name || '',
                email: user.email,
                height: null,
                gender: null,
                bio: '',
                targetCalories: 850,
                targetSleep: 8,
                targetExercise: 30,
              };
              set({ profile: defaultProfile, isLoading: false });
              return defaultProfile;
            }
            console.warn('Supabase fetch failed:', error.message);
            set({ isLoading: false });
            return get().profile;
          }

          const profile = {
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: user.email,
            height: data.height,
            gender: data.gender,
            bio: data.bio || '',
            targetCalories: data.target_calories || 850,
            targetSleep: data.target_sleep || 8,
            targetExercise: data.target_exercise || 30,
          };

          set({ profile, isLoading: false });
          return profile;
        } catch (error) {
          console.error('Get profile error:', error);
          set({ isLoading: false });
          return get().profile;
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const updateData = {
              user_id: user.id,
              first_name: profileData.firstName,
              last_name: profileData.lastName,
              height: profileData.height ? parseFloat(profileData.height) : null,
              gender: profileData.gender || null,
              bio: profileData.bio || null,
              target_calories: profileData.targetCalories || 850,
              target_sleep: profileData.targetSleep || 8,
              target_exercise: profileData.targetExercise || 30,
              updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
              .from('profiles')
              .upsert(updateData, { onConflict: 'user_id' });

            if (error) {
              console.warn('Supabase update failed:', error.message);
            }
          }

          set({ profile: profileData, isLoading: false });
          return true;
        } catch (error) {
          console.error('Update profile error:', error);
          set({
            error: error.message || 'Failed to update profile',
            isLoading: false,
          });
          return false;
        }
      },

      // Update avatar/photo
      updateAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user && file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, file, { upsert: true });

            if (uploadError) {
              console.warn('Avatar upload failed:', uploadError.message);
            }
          }

          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Update avatar error:', error);
          set({
            error: error.message || 'Failed to update avatar',
            isLoading: false,
          });
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear profile
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

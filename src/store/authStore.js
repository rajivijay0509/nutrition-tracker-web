import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,

  // Initialize auth state from Supabase session
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user || null,
        isAuthenticated: !!session,
        isInitialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isInitialized: true });
    }
  },

  // Login with email/password
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        session: data.session,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Register new user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Sign up without metadata to avoid trigger issues
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // If email confirmation is required, user won't be logged in yet
      if (data.user && !data.session) {
        set({
          isLoading: false,
          error: 'Please check your email to confirm your account.',
        });
        return false;
      }

      // Create profile manually after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            height_cm: userData.heightCm ? parseInt(userData.heightCm) : null,
            gender: userData.gender,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail registration if profile creation fails
        }
      }

      set({
        session: data.session,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Login with OAuth provider (Google, Apple, etc.)
  loginWithOAuth: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      // OAuth will redirect, so we don't set loading to false here
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Update user profile
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      set({ user: data.user, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import './styles/App.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FoodLoggingPage from './pages/FoodLoggingPage';
import WellnessPage from './pages/WellnessPage';
import HistoryPage from './pages/HistoryPage';
import RecipesPage from './pages/RecipesPage';
import ProfilePage from './pages/ProfilePage';
import GoalsPage from './pages/GoalsPage';
import CommunityPage from './pages/CommunityPage';

// Components
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize Supabase auth session
    initialize();
  }, [initialize]);

  // Show loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/food-logging" element={<FoodLoggingPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

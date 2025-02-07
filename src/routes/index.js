import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundaryWrapper from '../components/ErrorHandling/ErrorBoundaryWrapper';
import { useAuth } from '../hooks/useAuth';

// Lazy load components
const Dashboard = React.lazy(() => import('../components/Dashboard/DashboardLayout'));
const PredictionForm = React.lazy(() => import('../components/PredictionForm'));
const AnalyticsDashboard = React.lazy(() => import('../components/Analytics/AnalyticsDashboard'));
const UserProfile = React.lazy(() => import('../components/Profile/UserProfile'));
const UserSettings = React.lazy(() => import('../components/Settings/UserSettings'));
const Auth = React.lazy(() => import('../components/Auth/AuthPage'));
const RealTimeMonitor = React.lazy(() => import('../components/RealTimeMonitor'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundaryWrapper>
        <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<Auth type="forgot" />} />
            <Route path="/reset-password" element={<Auth type="reset" />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/predict" element={
              <ProtectedRoute>
                <PredictionForm />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/monitor" element={
              <ProtectedRoute>
                <RealTimeMonitor />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={
              <ErrorBoundaryWrapper>
                <div>404 - Page Not Found</div>
              </ErrorBoundaryWrapper>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundaryWrapper>
    </BrowserRouter>
  );
};

export default AppRoutes;
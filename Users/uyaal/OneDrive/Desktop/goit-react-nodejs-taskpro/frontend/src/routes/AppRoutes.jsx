import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import WelcomePage from '../pages/WelcomePage.jsx';

import PrivateRoute from './PrivateRoutes.jsx';
import PublicRoute from './PublicRoutes.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />

      <Route
        path="/auth/:id"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/home/:boardId"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

export default AppRoutes;

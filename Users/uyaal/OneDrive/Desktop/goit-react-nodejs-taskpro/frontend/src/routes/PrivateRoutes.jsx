import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

function PrivateRoute({ children }) {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;

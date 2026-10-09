import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PublicRoute;

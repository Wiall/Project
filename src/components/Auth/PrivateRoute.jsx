import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { useContext } from 'react'

export function PrivateRoute({ children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    throw new Error('Context not found');
  }

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

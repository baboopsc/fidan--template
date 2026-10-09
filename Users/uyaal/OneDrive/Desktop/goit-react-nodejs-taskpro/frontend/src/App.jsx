import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import WorkspaceLoader from './components/WorkspaceLoader/WorkspaceLoader.jsx';
import { refreshUserThunk } from './store/auth/authSlice.js';
import { selectIsRefreshing } from './store/auth/authSelectors.js';

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(refreshUserThunk());
  }, [dispatch]);

  if (isRefreshing) {
    return <WorkspaceLoader />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

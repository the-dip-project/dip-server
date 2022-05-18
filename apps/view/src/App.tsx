import { Navigate, Outlet, Route, Routes } from 'react-router';

import AuthGuard from './components/AuthGuard/AuthGuard';
import Dashboard from './components/Dashboard/Dashboard';
import OverviewPane from './components/Dashboard/OverviewPane/OverviewPane';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <Routes>
      <Route
        element={
          <>
            <AuthGuard />
            <Outlet />
          </>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <>
              <Dashboard />
              <Outlet />
            </>
          }
        >
          <Route path="" element={<Navigate to="/overview" />} />
          <Route path="overview" element={<OverviewPane />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

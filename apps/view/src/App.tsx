import { Navigate, Outlet, Route, Routes } from 'react-router';

import AuthGuard from './components/AuthGuard/AuthGuard';
import { route as adminUtilsRoute } from './components/Dashboard/AdminUtilsPane';
import Dashboard from './components/Dashboard/Dashboard';
import { route as managerRoute } from './components/Dashboard/ManagerPane';
import {
  meta as overviewMeta,
  route as overviewRoute,
} from './components/Dashboard/OverviewPane';
import { route as profileRoute } from './components/Dashboard/ProfilePane';
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
          <Route path="" element={<Navigate to={overviewMeta.path} />} />
          {overviewRoute}
          {managerRoute}
          {profileRoute}
          {adminUtilsRoute}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

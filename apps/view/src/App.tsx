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
import MasterDialog from './components/MasterDialog/MasterDialog';
import NotFound from './components/NotFound/NotFound';
import Notificator from './components/Notifcator/Notificator';

function App() {
  return (
    <Routes>
      <Route
        element={
          <>
            <AuthGuard />
            <MasterDialog />
            <Notificator />
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

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

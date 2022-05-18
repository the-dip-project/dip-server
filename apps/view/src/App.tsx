import { Route, Routes } from 'react-router';
import AuthGuard from './components/AuthGuard/AuthGuard';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;

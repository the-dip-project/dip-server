import { Route, Routes } from 'react-router';
import AuthGuard from './components/AuthGuard/AuthGuard';

function App() {
  return (
    <Routes>
      <Route path="*" element={<AuthGuard />} />
    </Routes>
  );
}

export default App;

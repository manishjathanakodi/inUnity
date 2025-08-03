import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <CssVarsProvider defaultMode="light">
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
          <Router>
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </div>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

export default App;

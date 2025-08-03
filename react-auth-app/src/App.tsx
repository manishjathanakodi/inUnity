import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { ThemeProvider as MuiThemeProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

// Create a Material-UI theme
const muiTheme = createTheme(adaptV4Theme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
}));

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProvider theme={muiTheme}>
        <JoyCssVarsProvider defaultMode="light">
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
        </JoyCssVarsProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import type { CustomInputProps } from '../types';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  InputAdornment,
  Link,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Visibility, VisibilityOff, LightMode, DarkMode } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state: { login: (email: string, password: string) => Promise<void> }) => state.login);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAppTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login function from the auth store
      await login(email, password);
      // Navigate to dashboard after successful login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        p: 2,
        overflow: 'auto',
      }}
    >
      <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <IconButton
          id="theme-toggle-button"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: isDarkMode ? 'grey.800' : 'grey.200',
            '&:hover': {
              bgcolor: isDarkMode ? 'grey.700' : 'grey.300',
            },
          }}
        >
          {isDarkMode ? (
            <LightMode sx={{ color: 'orange' }} />
          ) : (
            <DarkMode sx={{ color: 'orange' }} />
          )}
        </IconButton>
      </Tooltip>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          bgcolor: 'background.paper',
          position: 'relative',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6
          }
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Box
            bgcolor="error.light"
            color="error.contrastText"
            p={2}
            mb={3}
            borderRadius={1}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login-email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            inputProps={{
              'data-testid': 'email-input',
              'aria-label': 'Email address',
            } as CustomInputProps}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="login-password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{
              'data-testid': 'password-input',
              'aria-label': 'Password',
            } as CustomInputProps}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="toggle-password-visibility"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="remember-me"
                  value="remember"
                  color="primary"
                  sx={{ color: 'orange' }}
                  inputProps={{
                    'aria-label': 'Remember me',
                    'data-testid': 'remember-me-checkbox'
                  }}
                />
              }
              label="Remember me"
            />
            <Link 
              id="forgot-password-link" 
              href="#" 
              variant="body2" 
              color="primary"
              data-testid="forgot-password"
            >
              Forgot password?
            </Link>
          </Box>
          
          <Button
            id="login-button"
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ 
              mt: 2, 
              mb: 2, 
              py: 1.5,
              bgcolor: 'orange.main',
              '&:hover': {
                bgcolor: 'orange.dark',
              },
            }}
            data-testid="login-button"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                id="signup-link"
                component={RouterLink} 
                to="/signup" 
                color="primary"
                data-testid="signup-link"
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

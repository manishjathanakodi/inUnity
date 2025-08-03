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
import { useTheme as useAppTheme } from '../context/ThemeContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAppTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual signup logic
      // await signup(email, password);
      // For now, just navigate to login
      navigate('/login');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        p: 2,
        position: 'relative',
      }}
    >
      <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <IconButton
          id="signup-theme-toggle-button"
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
          transform: 'translateY(-20px)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-25px)',
          },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create an Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join us today!
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
            id="signup-email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            inputProps={{
              'data-testid': 'signup-email-input',
              'aria-label': 'Email address',
            } as CustomInputProps}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="signup-password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{
              'data-testid': 'signup-password-input',
              'aria-label': 'Password',
            } as CustomInputProps}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="toggle-signup-password-visibility"
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

          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm-password"
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error && password !== confirmPassword}
            helperText={error && password !== confirmPassword ? error : ''}
            inputProps={{
              'data-testid': 'confirm-password-input',
              'aria-label': 'Confirm password',
            } as CustomInputProps}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                id="accept-terms"
                value="acceptTerms"
                color="primary"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                sx={{ color: isDarkMode ? 'orange' : 'primary' }}
                inputProps={{
                  'data-testid': 'terms-checkbox',
                  'aria-label': 'I agree to the terms and conditions',
                } as CustomInputProps}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link 
                id="terms-link" 
                href="#" 
                color="primary"
                data-testid="terms-link"
              >
                Terms and Conditions
              </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />
          
          <Button
            id="signup-button"
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
            data-testid="signup-button"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                id="login-link"
                component={RouterLink} 
                to="/login" 
                color="primary"
                data-testid="login-link"
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;

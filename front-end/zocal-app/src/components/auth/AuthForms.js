import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Container,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { loginUser, registerUser, clearError } from '../../store/authSlice';
import { VALIDATION_MESSAGES } from '../../constants';

const AuthForms = () => {
  const dispatch = useDispatch();
  const { loading: authLoading, error: authError } = useSelector(state => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authFormErrors, setAuthFormErrors] = useState({});

  // Handle authentication form input changes
  const handleAuthFormChange = (e) => {
    const { name, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (authFormErrors[name]) {
      setAuthFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle between sign up and log in
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setAuthFormErrors({});
    setAuthFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    dispatch(clearError());
  };

  // Validate authentication form
  const validateAuthForm = () => {
    const errors = {};
    
    if (isSignUp && !authFormData.name.trim()) {
      errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
    }
    
    if (!authFormData.email.trim()) {
      errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(authFormData.email)) {
      errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }
    
    if (!authFormData.password) {
      errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    } else if (authFormData.password.length < 6) {
      errors.password = VALIDATION_MESSAGES.PASSWORD_LENGTH;
    }
    
    if (isSignUp && authFormData.password !== authFormData.confirmPassword) {
      errors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH;
    }
    
    return errors;
  };

  // Handle authentication form submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    const errors = validateAuthForm();
    if (Object.keys(errors).length > 0) {
      setAuthFormErrors(errors);
      return;
    }
    
    setAuthFormErrors({});
    
    try {
      if (isSignUp) {
        await dispatch(registerUser({
          name: authFormData.name,
          email: authFormData.email,
          password: authFormData.password
        })).unwrap();
      } else {
        await dispatch(loginUser({
          email: authFormData.email,
          password: authFormData.password
        })).unwrap();
      }
    } catch (error) {
      // Error handled by Redux
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Typography>
        
        {authError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authError}
          </Alert>
        )}
        
        <form onSubmit={handleAuthSubmit}>
          {isSignUp && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={authFormData.name}
              onChange={handleAuthFormChange}
              error={!!authFormErrors.name}
              helperText={authFormErrors.name}
              margin="normal"
              required
            />
          )}
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={authFormData.email}
            onChange={handleAuthFormChange}
            error={!!authFormErrors.email}
            helperText={authFormErrors.email}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={authFormData.password}
            onChange={handleAuthFormChange}
            error={!!authFormErrors.password}
            helperText={authFormErrors.password}
            margin="normal"
            required
          />
          
          {isSignUp && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={authFormData.confirmPassword}
              onChange={handleAuthFormChange}
              error={!!authFormErrors.confirmPassword}
              helperText={authFormErrors.confirmPassword}
              margin="normal"
              required
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={authLoading}
          >
            {authLoading ? <CircularProgress size={24} /> : (isSignUp ? 'Sign Up' : 'Log In')}
          </Button>
          
          <Box textAlign="center">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleAuthMode();
              }}
              sx={{ cursor: 'pointer' }}
            >
              {isSignUp ? 'Existing user Log In' : 'New user Sign Up'}
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthForms;
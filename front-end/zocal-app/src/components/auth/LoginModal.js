import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Typography,
  InputAdornment
} from '@mui/material';
import { 
  Close as CloseIcon,
  Visibility,
  VisibilityOff 
} from '@mui/icons-material';
import { 
  loginUser, 
  resendVerificationEmail,
  clearError, 
  clearSuccessMessage,
  clearResendSuccess
} from '../../store/authSlice';

const LoginModal = ({ open, onClose, onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    successMessage, 
    resendVerificationSuccess
  } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({ email: '', password: '' });
      setFormErrors({});
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      dispatch(clearResendSuccess());
    }
  }, [open, dispatch]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    
    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
      
      // Close modal on successful login
      onClose();
    } catch (error) {
      // Errors handled by Redux state
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setFormErrors({ email: 'Please enter a valid email address to resend verification' });
      return;
    }

    try {
      await dispatch(resendVerificationEmail({
        email: formData.email
      })).unwrap();
      
      // Success handled by Redux state
    } catch (error) {
      // Error handled by Redux state
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setFormData({ email: '', password: '' });
    setFormErrors({});
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    dispatch(clearResendSuccess());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Log In</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Error Alert - but not for email verification errors */}
          {error && !(error.toLowerCase().includes('verify your email')) && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}
          
          {/* Success Alert */}
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearSuccessMessage())}
            >
              {successMessage}
            </Alert>
          )}
          
          {/* Resend Verification Success Alert */}
          {resendVerificationSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearResendSuccess())}
            >
              Verification email sent! Please check your inbox for a fresh verification link.
            </Alert>
          )}
          
          {/* Resend Verification Email Alert */}
          {error && error.toLowerCase().includes('verify your email') && !resendVerificationSuccess && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleResendVerification}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                  Resend Email
                </Button>
              }
            >
              {error} Need a new verification email? Click "Resend Email" to get a fresh link.
            </Alert>
          )}

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            margin="normal"
            required
          />
          
          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 3, pt: 1 }}>
        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mb: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
        </Button>
        
        {/* Mode switching links */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Box sx={{ mb: 1 }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToForgotPassword();
              }}
              sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Forgot password?
            </Link>
          </Box>
          
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToSignUp();
            }}
            sx={{ cursor: 'pointer' }}
          >
            New user? Sign Up
          </Link>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
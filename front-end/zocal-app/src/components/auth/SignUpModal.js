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
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff 
} from '@mui/icons-material';
import { 
  registerUser, 
  clearError, 
  clearSuccessMessage 
} from '../../store/authSlice';

const SignUpModal = ({ open, onClose, onSwitchToLogin, onRegistrationSuccess }) => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    successMessage
  } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, or false

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({ email: '', password: '', confirmPassword: '' });
      setFormErrors({});
      setPasswordValidation({ minLength: false, hasLetter: false, hasNumber: false, hasSpecial: false });
      setPasswordMatch(null);
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    }
  }, [open, dispatch]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password)
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(v => v);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time password validation
    if (name === 'password') {
      validatePassword(value);
      
      // Check password match if confirm password exists
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }

    // Real-time password confirmation validation
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
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
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must meet all requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })).unwrap();
      
      // Close modal and show registration success modal
      onClose();
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (error) {
      // Errors handled by Redux state
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setFormData({ email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setPasswordValidation({ minLength: false, hasLetter: false, hasNumber: false, hasSpecial: false });
    setPasswordMatch(null);
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Sign Up</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Error Alert */}
          {error && (
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

          {/* Password Requirements */}
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Password must contain:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries({
                'At least 8 characters': passwordValidation.minLength,
                'At least one letter': passwordValidation.hasLetter,
                'At least one number': passwordValidation.hasNumber,
                'At least one special character (@$!%*?&)': passwordValidation.hasSpecial
              }).map(([requirement, isValid]) => (
                <Box key={requirement} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isValid ? 
                    <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} /> : 
                    <CancelIcon sx={{ fontSize: 14, color: 'error.main' }} />
                  }
                  <Typography variant="caption" color={isValid ? 'success.main' : 'error.main'}>
                    {requirement}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formData.confirmPassword && passwordMatch !== null && (
                    passwordMatch ? 
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} /> : 
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
        
        {/* Mode switching links */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
            sx={{ cursor: 'pointer' }}
          >
            Existing user? Log In
          </Link>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SignUpModal;
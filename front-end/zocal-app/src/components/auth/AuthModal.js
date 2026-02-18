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
  loginUser, 
  registerUser, 
  forgotPassword, 
  clearError, 
  clearSuccessMessage 
} from '../../store/authSlice';

const AuthModal = ({ open, onClose, onRegistrationSuccess }) => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    successMessage, 
    registrationSuccess, 
    forgotPasswordSuccess 
  } = useSelector(state => state.auth);

  // Authentication mode: 'login', 'signup', 'forgot'
  const [authMode, setAuthMode] = useState('login');
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

  // Password confirmation validation
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, or false

  // Reset form when modal opens/closes or auth mode changes
  useEffect(() => {
    if (open) {
      setFormData({ email: '', password: '', confirmPassword: '' });
      setFormErrors({});
      setPasswordValidation({ minLength: false, hasLetter: false, hasNumber: false, hasSpecial: false });
      setPasswordMatch(null);
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    }
  }, [open, authMode, dispatch]);

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

    // Real-time password validation for signup
    if (name === 'password' && authMode === 'signup') {
      validatePassword(value);
      
      // Check password match if confirm password exists
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }

    // Real-time password confirmation validation
    if (name === 'confirmPassword' && authMode === 'signup') {
      setPasswordMatch(value === formData.password);
    }
  };

  // Validate form based on current mode
  const validateForm = () => {
    const errors = {};
    
    // Email validation (all modes)
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Mode-specific validation
    if (authMode === 'signup') {
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
    } else if (authMode === 'login') {
      // Password validation for login
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
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
      if (authMode === 'login') {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();
        
        // Close modal on successful login
        onClose();
      } else if (authMode === 'signup') {
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
      } else if (authMode === 'forgot') {
        await dispatch(forgotPassword({
          email: formData.email
        })).unwrap();
        
        // Don't close modal - show success message
      }
    } catch (error) {
      // Errors are handled by Redux
    }
  };

  // Change auth mode
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setPasswordValidation({ minLength: false, hasLetter: false, hasNumber: false, hasSpecial: false });
    setPasswordMatch(null);
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setAuthMode('login');
    setFormData({ email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setPasswordValidation({ minLength: false, hasLetter: false, hasNumber: false, hasSpecial: false });
    setPasswordMatch(null);
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };

  // Get modal title
  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Log In';
      case 'signup': return 'Sign Up';
      case 'forgot': return 'Forgot Password';
      default: return 'Authentication';
    }
  };

  // Get submit button text
  const getSubmitButtonText = () => {
    if (loading) return <CircularProgress size={24} color="inherit" />;
    switch (authMode) {
      case 'login': return 'Log In';
      case 'signup': return 'Register';
      case 'forgot': return 'Send Reset Email';
      default: return 'Submit';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        {getTitle()}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {/* Success Message (for forgot password only) */}
        {(forgotPasswordSuccess && !registrationSuccess) && successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Email Field (All modes) */}
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
          
          {/* Password Field (Login and Signup) */}
          {authMode !== 'forgot' && (
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
          )}

          {/* Password Requirements (Signup only) */}
          {authMode === 'signup' && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Password must contain:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: passwordValidation.minLength ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {passwordValidation.minLength ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                  At least 8 characters
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: passwordValidation.hasLetter ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {passwordValidation.hasLetter ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                  One letter
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: passwordValidation.hasNumber ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {passwordValidation.hasNumber ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                  One number
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: passwordValidation.hasSpecial ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {passwordValidation.hasSpecial ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                  One special character (@$!%*?&)
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Confirm Password Field (Signup only) */}
          {authMode === 'signup' && (
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
          )}
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
          {getSubmitButtonText()}
        </Button>
        
        {/* Mode switching links */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          {authMode === 'login' && (
            <>
              <Box sx={{ mb: 1 }}>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    switchAuthMode('forgot');
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
                  switchAuthMode('signup');
                }}
                sx={{ cursor: 'pointer' }}
              >
                New user? Sign Up
              </Link>
            </>
          )}
          
          {authMode === 'signup' && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                switchAuthMode('login');
              }}
              sx={{ cursor: 'pointer' }}
            >
              Existing user? Log In
            </Link>
          )}
          
          {authMode === 'forgot' && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                switchAuthMode('login');
              }}
              sx={{ cursor: 'pointer' }}
            >
              Back to Log In
            </Link>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
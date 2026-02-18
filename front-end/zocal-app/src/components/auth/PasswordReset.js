import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { resetPassword, clearError, clearSuccessMessage } from '../../store/authSlice';

const PasswordReset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { 
    loading, 
    error, 
    successMessage, 
    resetPasswordSuccess 
  } = useSelector(state => state.auth);

  const [token] = useState(searchParams.get('token'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
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

  // Clear errors and success messages on component mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());

    // Check if token exists
    if (!token) {
      navigate('/');
    }
  }, [dispatch, token, navigate]);

  // Redirect to home after successful reset
  useEffect(() => {
    if (resetPasswordSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [resetPasswordSuccess, navigate]);

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
      await dispatch(resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })).unwrap();
    } catch (error) {
      // Errors are handled by Redux
    }
  };

  // Handle back to home
  const handleBackHome = () => {
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBackHome} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Reset Password
          </Typography>
        </Box>

        {/* Success Message */}
        {resetPasswordSuccess && successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Redirecting to home page in 3 seconds...
            </Typography>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!resetPasswordSuccess && (
          <>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Please enter your new password. Make sure it meets all the security requirements.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <TextField
                fullWidth
                label="New Password"
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

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm New Password"
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

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>

              {/* Back to Home Link */}
              <Button
                fullWidth
                variant="text"
                onClick={handleBackHome}
                disabled={loading}
              >
                Back to Home
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PasswordReset;
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
  Typography
} from '@mui/material';
import { 
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  forgotPassword, 
  clearError, 
  clearSuccessMessage 
} from '../../store/authSlice';

const ForgotPasswordModal = ({ open, onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    successMessage, 
    forgotPasswordSuccess
  } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({ email: '' });
      setFormErrors({});
      dispatch(clearError());
      dispatch(clearSuccessMessage());
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
      await dispatch(forgotPassword({
        email: formData.email
      })).unwrap();
      
      // Don't close modal - show success message
    } catch (error) {
      // Errors handled by Redux state
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setFormData({ email: '' });
    setFormErrors({});
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Forgot Password</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

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
            autoFocus
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
          disabled={loading || forgotPasswordSuccess}
          sx={{ mb: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
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
            Back to Log In
          </Link>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { verifyEmail, clearError, clearSuccessMessage } from '../../store/authSlice';

const EmailVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { 
    loading, 
    error, 
    successMessage, 
    verificationSuccess,
    isAuthenticated 
  } = useSelector(state => state.auth);

  const [token] = useState(searchParams.get('token'));
  const verificationAttempted = useRef(false);

  // Clear errors and success messages on component mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  // Attempt verification when component mounts
  useEffect(() => {
    if (token && !verificationAttempted.current && !verificationSuccess && !loading) {
      verificationAttempted.current = true;
      
      dispatch(verifyEmail({ token }))
        .unwrap()
        .then(() => {
          // Verification successful - user is now logged in
          setTimeout(() => {
            navigate('/');
          }, 3000);
        })
        .catch((error) => {
          // Error handled by Redux state
        });
    }
  }, [token, verificationSuccess, loading]);

  // Redirect to home if already authenticated (from successful verification)
  useEffect(() => {
    if (verificationSuccess && isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [verificationSuccess, isAuthenticated, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    if (token && !loading) {
      verificationAttempted.current = false;
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Email Verification
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.secondary">
              Verifying your email address...
            </Typography>
          </Box>
        )}

        {/* Success State */}
        {verificationSuccess && successMessage && !loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              {successMessage}
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              You are now logged in and will be redirected to the home page in 3 seconds.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleGoHome}
              sx={{ mt: 1 }}
            >
              Go to Home Page Now
            </Button>
          </Box>
        )}

        {/* Error State */}
        {error && !loading && !verificationSuccess && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This could happen if:
            </Typography>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" component="ul" sx={{ m: 0 }}>
                <li>The verification link has expired (links are valid for 30 minutes)</li>
                <li>The link has already been used</li>
                <li>The link is invalid or corrupted</li>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {token && (
                <Button 
                  variant="outlined" 
                  onClick={handleTryAgain}
                  disabled={loading}
                >
                  Try Again
                </Button>
              )}
              <Button 
                variant="contained" 
                onClick={handleGoHome}
              >
                Go to Home Page
              </Button>
            </Box>
          </Box>
        )}

        {/* No Token State */}
        {!token && !loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'warning.main' }} />
            <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
              No verification token found in the URL.
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Please make sure you clicked on the correct link from your verification email.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleGoHome}
            >
              Go to Home Page
            </Button>
          </Box>
        )}

        {/* Footer Information */}
        {!verificationSuccess && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Need help? Make sure you're clicking the verification link from the email we sent you.
              If you're still having trouble, please contact support.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerification;
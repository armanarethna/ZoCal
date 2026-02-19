import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { 
  Close as CloseIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const RegistrationSuccessModal = ({ open, onClose, onLoginClick }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        Registration Successful!
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: 'success.main', 
              mb: 2 
            }} 
          />
          
          <EmailIcon 
            sx={{ 
              fontSize: 48, 
              color: 'primary.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h6" gutterBottom>
            Check Your Email
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a verification email to your email address. Please check your inbox and click the verification link to activate your account.
          </Typography>
          
          <Box sx={{ backgroundColor: 'info.light', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Important:</strong> The verification link will expire in 30 minutes for security reasons.
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            After verification, you'll be automatically logged in and redirected to your dashboard.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 3, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
        >
          Got it, I'll check my email
        </Button>
        
        <Button
          fullWidth
          variant="text"
          onClick={onLoginClick}
        >
          Already verified? Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationSuccessModal;
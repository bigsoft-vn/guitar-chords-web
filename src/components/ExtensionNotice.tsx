import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { GlobalErrorHandler } from '../utils/errorHandler';

const ExtensionNotice: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if browser extensions are detected
    const hasExtensions = GlobalErrorHandler.isExtensionEnvironment();
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasBeenDismissed = localStorage.getItem('extension-notice-dismissed') === 'true';
    
    if (hasExtensions && isDevelopment && !hasBeenDismissed) {
      setShowNotice(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotice(false);
    localStorage.setItem('extension-notice-dismissed', 'true');
  };

  if (!showNotice || dismissed) {
    return null;
  }

  return (
    <Collapse in={showNotice}>
      <Alert 
        severity="info" 
        sx={{ mb: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleDismiss}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
        icon={<Warning />}
      >
        <AlertTitle>Phát hiện Browser Extension</AlertTitle>
        Nếu bạn gặp lỗi JavaScript trong console, có thể do browser extension (MetaMask, etc.) gây ra. 
        Những lỗi này không ảnh hưởng đến ứng dụng Guitar Chords.
      </Alert>
    </Collapse>
  );
};

export default ExtensionNotice;
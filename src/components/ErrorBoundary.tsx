import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Don't show error boundary for browser extension errors
    if (ErrorBoundary.isBrowserExtensionError(error)) {
      console.info('Browser extension error caught and ignored by ErrorBoundary');
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Don't log browser extension errors
    if (!ErrorBoundary.isBrowserExtensionError(error)) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private static isBrowserExtensionError(error: Error): boolean {
    const errorString = error.toString();
    const stackString = error.stack || '';
    
    return (
      errorString.includes('chrome-extension://') ||
      errorString.includes('moz-extension://') ||
      stackString.includes('chrome-extension://') ||
      stackString.includes('moz-extension://') ||
      stackString.includes('inpage.js') ||
      stackString.includes('contentscript.js')
    );
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          p={3}
        >
          <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Có lỗi xảy ra
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ứng dụng đã gặp lỗi không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'left' }}>
                <strong>Chi tiết lỗi:</strong><br />
                {this.state.error.message}
              </Typography>
            )}
            <Box display="flex" gap={2} justifyContent="center">
              <Button variant="contained" onClick={this.handleReload}>
                Tải lại trang
              </Button>
              <Button variant="outlined" onClick={this.handleGoHome}>
                Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
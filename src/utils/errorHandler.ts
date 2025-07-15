// Global error handler for browser extension conflicts and other errors

export class GlobalErrorHandler {
  static init() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      
      // Prevent browser extension errors from crashing the app
      if (this.isBrowserExtensionError(event.reason)) {
        console.info('Browser extension error detected and ignored:', event.reason);
        event.preventDefault();
        return;
      }
      
      // Log other errors for debugging
      this.logError('Unhandled Promise Rejection', event.reason);
    });

    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      // Ignore browser extension errors
      if (this.isBrowserExtensionError(event.error) || this.isBrowserExtensionError(event.filename)) {
        console.info('Browser extension error detected and ignored:', event.error);
        event.preventDefault();
        return;
      }
      
      this.logError('Uncaught Error', event.error);
    });

    // Override console.error to filter out extension errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorString = args.join(' ');
      
      // Don't log browser extension errors
      if (this.isBrowserExtensionError(errorString)) {
        return;
      }
      
      originalConsoleError.apply(console, args);
    };
  }

  private static isBrowserExtensionError(error: any): boolean {
    if (!error) return false;
    
    const errorString = error.toString ? error.toString() : String(error);
    
    // Common patterns for browser extension errors
    const extensionPatterns = [
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'ms-browser-extension://',
      'egjidjbpglichdcondbcbdnbeeppgdph', // MetaMask extension ID
      'nkbihfbeogaeaoehlefnkodbefgpgknn', // MetaMask extension ID
      'fhbohimaelbohpjbbldcngcnapndodjp', // Binance extension ID
      'Script error.',
      'Non-Error promise rejection captured',
      'inpage.js',
      'contentscript.js',
    ];
    
    return extensionPatterns.some(pattern => 
      errorString.includes(pattern)
    );
  }

  private static logError(type: string, error: any) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${type}`);
      console.error(error);
      console.groupEnd();
    }
    
    // In production, you might want to send to error tracking service
    // Example: Sentry, LogRocket, etc.
  }

  static isExtensionEnvironment(): boolean {
    return !!(
      (window as any).chrome?.runtime ||
      (window as any).browser?.runtime ||
      document.querySelector('script[src*="extension://"]')
    );
  }
}

// Helper function to safely access potentially undefined objects
export function safeAccess<T>(obj: any, path: string[], defaultValue: T): T {
  try {
    return path.reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch (error) {
    console.warn(`Safe access failed for path ${path.join('.')}: ${error}`);
    return defaultValue;
  }
}

// Debounced error reporter to prevent spam
export class ErrorReporter {
  private static errorCounts = new Map<string, number>();
  private static readonly MAX_SAME_ERROR = 5;

  static report(error: Error | string, context?: string) {
    const errorKey = error.toString();
    const count = this.errorCounts.get(errorKey) || 0;
    
    if (count >= this.MAX_SAME_ERROR) {
      return; // Don't report the same error too many times
    }
    
    this.errorCounts.set(errorKey, count + 1);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'App'}] Error:`, error);
    }
  }
}
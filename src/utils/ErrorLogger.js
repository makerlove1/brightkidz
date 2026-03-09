/**
 * Error Logger Utility
 * Logs errors to console with detailed information for debugging
 */

class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Catch Vue errors (if Vue is available)
    if (window.app && window.app.config) {
      window.app.config.errorHandler = (err, vm, info) => {
        this.logError('Vue Error', {
          error: err,
          component: vm?.$options?.name || 'Unknown',
          info: info,
        });
      };
    }
  }

  logError(type, details) {
    const timestamp = new Date().toISOString();
    const errorEntry = {
      type,
      timestamp,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Add to errors array
    this.errors.push(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Console output with styling
    console.group(`🔴 ${type} - ${timestamp}`);
    console.error('Details:', details);
    console.log('URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    
    if (details.error && details.error.stack) {
      console.log('Stack Trace:', details.error.stack);
    }
    
    console.groupEnd();

    // Store in localStorage for persistence
    this.saveToLocalStorage();

    // Send to server in production (if endpoint is configured)
    if (!this.isDevelopment && this.shouldReportToServer()) {
      this.sendToServer(errorEntry);
    }
  }

  logWarning(message, details = {}) {
    console.warn(`⚠️ Warning: ${message}`, details);
    this.logError('Warning', { message, ...details });
  }

  logInfo(message, details = {}) {
    if (this.isDevelopment) {
      console.info(`ℹ️ Info: ${message}`, details);
    }
  }

  logSuccess(message, details = {}) {
    if (this.isDevelopment) {
      console.log(`✅ Success: ${message}`, details);
    }
  }

  logAudioError(audioPath, error) {
    this.logError('Audio Loading Error', {
      path: audioPath,
      error: error.message || error,
      message: `Failed to load audio file: ${audioPath}`,
    });
  }

  logLanguageError(language, error) {
    this.logError('Language Error', {
      language,
      error: error.message || error,
      message: `Error switching to language: ${language}`,
    });
  }

  logComponentError(componentName, error, context = {}) {
    this.logError('Component Error', {
      component: componentName,
      error: error.message || error,
      context,
      stack: error.stack,
    });
  }

  saveToLocalStorage() {
    try {
      const recentErrors = this.errors.slice(-10); // Save last 10 errors
      localStorage.setItem('brightkidz_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.error('Failed to save errors to localStorage:', e);
    }
  }

  getErrors() {
    return this.errors;
  }

  getRecentErrors(count = 10) {
    return this.errors.slice(-count);
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('brightkidz_errors');
    console.log('✅ Error log cleared');
  }

  exportErrors() {
    const errorReport = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: this.errors,
    };
    
    const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brightkidz-errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ Error report exported');
  }

  shouldReportToServer() {
    // Add logic to determine if error should be sent to server
    // For now, return false
    return false;
  }

  sendToServer() {
    // Implement server reporting if needed
    // Example:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorEntry),
    // });
  }

  // Performance monitoring
  logPerformance(label, duration) {
    if (this.isDevelopment) {
      console.log(`⏱️ Performance: ${label} took ${duration.toFixed(2)}ms`);
    }
  }

  // Network error logging
  logNetworkError(url, error) {
    this.logError('Network Error', {
      url,
      error: error.message || error,
      status: error.status,
    });
  }

  // Debug mode
  enableDebugMode() {
    this.debugMode = true;
    console.log('🐛 Debug mode enabled');
  }

  disableDebugMode() {
    this.debugMode = false;
    console.log('🐛 Debug mode disabled');
  }

  debug(message, data) {
    if (this.debugMode || this.isDevelopment) {
      console.log(`🐛 DEBUG: ${message}`, data);
    }
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger();

// Expose to window for debugging
if (process.env.NODE_ENV === 'development') {
  window.errorLogger = errorLogger;
  console.log('🔧 ErrorLogger available at window.errorLogger');
  console.log('Commands:');
  console.log('  - errorLogger.getErrors() - Get all errors');
  console.log('  - errorLogger.clearErrors() - Clear error log');
  console.log('  - errorLogger.exportErrors() - Export errors to JSON');
  console.log('  - errorLogger.enableDebugMode() - Enable debug logging');
}

export default errorLogger;

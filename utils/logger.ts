/**
 * Simple centralized logger for all errors
 * Catches and logs all errors in one place
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, any>;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private errorBuffer: LogEntry[] = [];
  private maxBufferSize = 50;

  /**
   * Log an error with context
   */
  error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const logEntry: LogEntry = {
      level: 'error',
      message,
      error: error instanceof Error ? error : undefined,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Always log to console
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}`, error, context || '');
    } else {
      console.error(`[ERROR] ${message}`, error, context || '');
    }

    // Store in buffer
    this.addToBuffer(logEntry);

    // In production, you could send to an error tracking service here
    // Example: this.sendToErrorService(logEntry);
  }

  /**
   * Log info messages (only in development)
   */
  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '');
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Add log entry to buffer
   */
  private addToBuffer(entry: LogEntry): void {
    this.errorBuffer.push(entry);
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift(); // Remove oldest
    }
  }

  /**
   * Get recent errors (useful for debugging)
   */
  getRecentErrors(): LogEntry[] {
    return [...this.errorBuffer];
  }

  /**
   * Clear error buffer
   */
  clearBuffer(): void {
    this.errorBuffer = [];
  }

  /**
   * Send errors to API (optional - for production error tracking)
   */
  async sendToAPI(entry: LogEntry): Promise<void> {
    try {
      // Only send in production, and only errors
      if (!this.isDevelopment && entry.level === 'error') {
        await fetch('/api/errors/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        }).catch(() => {
          // Silently fail - don't break app if error logging fails
        });
      }
    } catch {
      // Silently fail
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = (message: string, error?: Error | unknown, context?: Record<string, any>) => {
  logger.error(message, error, context);
};

export const logInfo = (message: string, data?: any) => {
  logger.info(message, data);
};

export const logWarn = (message: string, data?: any) => {
  logger.warn(message, data);
};

export const logDebug = (message: string, data?: any) => {
  logger.debug(message, data);
};


/**
 * Global error handlers to catch ALL errors
 * Sets up window.onerror and unhandled promise rejection handlers
 */

import { logger } from './logger';

/**
 * Initialize global error handlers
 * Call this once in your app entry point (App.tsx or main.tsx)
 */
export function setupGlobalErrorHandlers(): void {
  // Catch JavaScript errors
  window.onerror = (message, source, lineno, colno, error) => {
    logger.error(
      `JavaScript Error: ${message}`,
      error || new Error(String(message)),
      {
        source,
        lineno,
        colno,
        type: 'javascript_error',
      }
    );
    return false; // Let default error handling continue
  };

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error(
      'Unhandled Promise Rejection',
      event.reason,
      {
        type: 'unhandled_promise_rejection',
        promise: event.promise,
      }
    );
    // Prevent default browser error logging (optional)
    // event.preventDefault();
  });

  // Catch resource loading errors (images, scripts, etc.)
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      logger.error(
        `Resource Loading Error: ${target.tagName}`,
        new Error(`Failed to load ${target.tagName}`),
        {
          type: 'resource_error',
          tagName: target.tagName,
          src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src,
        }
      );
    }
  }, true); // Use capture phase

  logger.info('Global error handlers initialized');
}

/**
 * Wrap async functions to catch errors automatically
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(
        errorMessage || `Error in ${fn.name || 'async function'}`,
        error,
        { args: args.length }
      );
      throw error; // Re-throw so caller can handle
    }
  }) as T;
}


// Logging utility for production-ready console output
export const logger = {
  // Always log errors
  error: (...args) => console.error(...args),
  
  // Always log warnings  
  warn: (...args) => console.warn(...args),
  
  // Only log info in development or when debug is enabled
  info: (...args) => {
    if (import.meta.env.DEV || localStorage.getItem('debug') === 'true') {
      console.log(...args);
    }
  },
  
  // Only log debug info in development
  debug: (...args) => {
    if (import.meta.env.DEV) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  // Always log important deployment/auth events
  important: (...args) => console.log(...args)
};

export default logger;

import { useState, useEffect, useCallback } from 'react';

export const useNotification = (timeout = 5000) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [error, success, timeout]);

  const clearNotifications = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  return { error, setError, success, setSuccess, clearNotifications };
};

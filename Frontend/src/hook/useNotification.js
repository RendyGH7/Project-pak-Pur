import { useState, useCallback, useRef, useEffect } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({});

  const showNotification = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      message,
      isVisible: true,
      duration
    };
    setNotifications(prev => [...prev, notification]);
    timers.current[id] = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      delete timers.current[id];
    }, duration + 300);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification
  };
};
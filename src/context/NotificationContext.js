import React, { createContext, useContext, useState, useEffect } from 'react';
import NotificationSystem from '../components/Notification/NotificationSystem';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id, progress: 1 }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isExiting: true } : notif
      )
    );
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  };

  // Function to make it easier to show notifications from components
  const showNotification = (message, type = 'info', title = '') => {
    addNotification({
      type,
      message,
      title: title || type.charAt(0).toUpperCase() + type.slice(1)
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          progress: Math.max(0, notif.progress - 0.01)
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    notifications.forEach(notif => {
      if (notif.progress <= 0) {
        removeNotification(notif.id);
      }
    });
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationSystem 
        notifications={notifications} 
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
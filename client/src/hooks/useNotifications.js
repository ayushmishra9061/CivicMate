import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return undefined;
    api.get('/notifications').then(({ data }) => setNotifications(data.notifications));

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket']
    });
    socket.emit('join:user', user.id);
    if (user.role === 'admin') socket.emit('join:admin');
    socket.on('notification:new', (notification) => {
      setNotifications((current) => [notification, ...current]);
    });

    return () => socket.disconnect();
  }, [user]);

  return { notifications, unread: notifications.filter((item) => !item.read).length };
};

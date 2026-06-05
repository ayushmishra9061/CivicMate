import { Notification } from '../models/Notification.js';
import { emitToAdmins, emitToUser } from './socketService.js';

export const createNotification = async ({ userId, title, message, meta }) => {
  const notification = await Notification.create({ userId, title, message, meta });
  emitToUser(userId.toString(), 'notification:new', notification);
  return notification;
};

export const notifyAdmins = (event, payload) => {
  emitToAdmins(event, payload);
};

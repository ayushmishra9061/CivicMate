import { Notification } from '../models/Notification.js';
import { emitToAdmins, emitToUser } from './socketService.js';

export const createNotification = async ({ userId, type, title, message, actionUrl, meta }) => {
  const notification = await Notification.create({ userId, type, title, message, actionUrl, meta });
  emitToUser(userId.toString(), 'notification:new', notification);
  return notification;
};

export const notifyAdmins = (event, payload) => {
  emitToAdmins(event, payload);
};

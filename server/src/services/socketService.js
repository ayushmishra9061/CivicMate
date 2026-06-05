let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('join:admin', () => {
      socket.join('admin');
    });
  });
};

export const emitToUser = (userId, event, payload) => {
  ioInstance?.to(`user:${userId}`).emit(event, payload);
};

export const emitToAdmins = (event, payload) => {
  ioInstance?.to('admin').emit(event, payload);
};

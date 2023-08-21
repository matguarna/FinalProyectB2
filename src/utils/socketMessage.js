exports.socketMessage = (io) => {
  messages = [];

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    //Socket que recibe el msj
    socket.on("message", (data) => {
      messages.push(data);
      io.emit("messageLogs", messages);
    });
    //Socket de auth
    socket.on("authenticated", (data) => {
      socket.broadcast.emit("newUserConnected", data);
    });
  });
};

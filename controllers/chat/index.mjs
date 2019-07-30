import socket from "socket.io";

let clients = {};

const chatServer = server => {
  const io = require("socket.io")(server);

  io.on("connection", client => {
    const clientId = client.id;
    const userData = {
      id: clientId,
      username: client.request.headers.username
    };

    clients[clientId] = userData;
    client.emit("all users", clients);
    client.broadcast.emit("new user", userData);

    client.on(
      "chat message",
      (message, sendToId) =>
        sendToId !== clientId &&
        io.to(sendToId).emit("chat message", message, clientId)
    );

    client.on("disconnect", () => {
      client.broadcast.json.emit("delete user", clientId);
      delete clients[clientId];
    });
  });
};

export default chatServer;

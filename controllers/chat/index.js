let users = [];

module.exports = server => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    let id = socket.id;
    let user = {
      id,
      username: socket.handshake.headers.username || "Guest"
    };
    !users.some(u => u.id === user.id) && users.push(user);
    //users[id] = user;
    console.log("User connected to chat: " + id);
    let usersObj = {};
    users.forEach(u => {
      if (u.id !== id) {
        usersObj[u.id] = u;
      }
    });
    socket.emit("all users", usersObj);
    socket.broadcast.emit("new user", user);

    socket.on("chat message", (data, recipientUserId) => {
      if (io.sockets.connected[recipientUserId]) {
        io.to(recipientUserId).emit("chat message", data, user.id);
      }
    });

    socket.on("disconnect", data => {
      console.log("User disconnected from chat: " + id);
      //delete users[id];
      users = users.filter(u => u.id !== id);

      socket.broadcast.emit("delete user", id);
    });
  });
};

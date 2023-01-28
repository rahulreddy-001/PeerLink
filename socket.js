const dataMap = new Map();

function root(socket) {
  socket.on("add", (data) => {
    dataMap.set(data.user, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of dataMap) {
      if (value === socket.id) {
        dataMap.delete(key);
      }
    }
  });

  socket.on("message", (data) => {
    socket.to(dataMap.get(data.to)).emit("message", data);
  });

  socket.on("getId", (data) => {
    socket.to(dataMap.get(data.to)).emit("getId", data);
  });

  socket.on("resId", (data) => {
    socket.to(dataMap.get(data.to)).emit("resId", data);
  });

  socket.on("endCall", (data) => {
    socket.to(dataMap.get(data.to)).emit("endCall", data);
  });
}

function room(socket) {
  socket.on("add", (data) => {
    socket.join(data.room);
  });
  socket.on("message", (data) => {
    socket.to(data.room).emit("message", data);
  });
}

function initSocket(io) {
  io.of("/").on("connection", root);
  io.of("/room").on("connection", room);
}
module.exports = { init: initSocket };

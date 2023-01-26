const dataMap = new Map();
function socket(socket) {
  socket.on("add", (data) => {
    dataMap.set(data.user, socket.id);
    console.table(dataMap);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of dataMap) {
      if (value === socket.id) {
        dataMap.delete(key);
      }
    }
  });

  socket.on("message", (data) => {
    socket
      .to(dataMap.get(data.to))
      .emit("message", { id: socket.id, message: data });
  });
}

module.exports = socket;

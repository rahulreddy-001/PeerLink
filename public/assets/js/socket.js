import state from "./state.js";
import helper from "./helpers.js";

export default {
  socket: null,
  init() {
    const socket = io();
    socket.on("connect", () => {
      socket.emit("add", { user: state.user });
    });

    socket.on("message", (data) => {
      data = data.message;
      if (data.from === state.id) {
        helper.addMessageBodyChat(data);
      } else {
        console.log(data);
      }
    });
    this.socket = socket;
  },

  emitMessage(msg) {
    this.socket.emit("message", msg);
  },
};

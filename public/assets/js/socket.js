import state from "./state.js";
import helper from "./helpers.js";

export default {
  root: null,
  room: null,
  init() {
    const root = io("/");
    const room = io("/room");

    root.on("connect", () => {
      root.emit("add", { user: state.user });
    });

    root.on("message", (data) => {
      if (data.from === state.id) {
        helper.addMessageBodyChat(data);
      } else {
        console.log(data);
      }
    });

    room.on("message", (data) => {
      if (data.room === state.id) {
        helper.addMessageBodyChat(data.message);
      } else {
        console.log(data);
      }
    });
    this.root = root;
    this.room = room;
  },

  emitMessage(msg) {
    this.root.emit("message", msg);
  },

  addToRoom(room) {
    helper.raiseError(
      "Room chats will be cleared permanently, When you leave the room.",
      10000
    );
    helper.raiseError("Share roomid to invite others to this room.", 10000);
    this.room.emit("add", { room: room });
  },
  emitRoomMessage(msg) {
    this.room.emit("message", { room: state.id, message: msg });
  },
};

import state from "./state.js";
import helper from "./helpers.js";

export default {
  root: null,
  room: null,
  peer: null,
  call: null,
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

    root.on("getId", (data) => {
      helper.handleGetId(data);
    });

    root.on("resId", (data) => {
      helper.handleResId(data);
    });

    room.on("message", (data) => {
      if (data.room === state.id) {
        helper.addMessageBodyChat(data.message);
      } else {
        console.log(data);
      }
    });

    root.on("endCall", (data) => {
      helper.endCallRequest(data);
    });

    this.root = root;
    this.room = room;
  },

  requestId(data) {
    this.root.emit("getId", data);
  },

  responseId(data) {
    this.root.emit("resId", data);
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

  initPeer() {
    console.log("Initiating new peer...");
    state.setOnCall(true);
    let peer = new Peer();
    peer.on("open", (id) => {
      console.log(id);
      state.setPeerId(id);
    });
    peer.on("call", (call) => {
      call.answer(helper.localStream);
      call.on("stream", (remoteStream) => {
        helper.remoteVideo.srcObject = remoteStream;
      });
      call.on("close", (e) => {
        helper.endCall();
      });
      this.call = call;
    });
    this.peer = peer;
  },

  callPeer(id) {
    var call = this.peer.call(id, helper.localStream);
    call.on("stream", (remoteStream) => {
      helper.remoteVideo.srcObject = remoteStream;
    });
    this.call = call;
  },

  closePeer(data) {
    state.setOnCall(false);
    this.root.emit("endCall", data);
    this.call.close();
  },

  busyCall(data) {
    this.root.emit("endCall", data);
  },

  closePeerRequest() {
    state.setOnCall(false);
    this.call.close();
  },
};

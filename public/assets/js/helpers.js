import state from "./state.js";
import query from "./query.js";
import socket from "./socket.js";

export default {
  init() {
    query.getFriends();
    this.addUserId();
    socket.init();
  },

  scrollChatBodyBottom() {
    const scrollDiv = document.querySelector(".cb");
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
  },

  addUserId() {
    const uidDiv = document.querySelector(
      "body > div > div.fl > div.un > div > span"
    );
    uidDiv.innerText = state.user;
  },

  updateFriendsList(data) {
    if (data.success) {
      const chatListDiv = document.querySelector(".f2");
      chatListDiv.innerHTML = "";
      data.data.friends.map((item) => {
        let tempDiv = document.createElement("div");
        tempDiv.innerText = item;
        tempDiv.classList.add("fi");
        chatListDiv.append(tempDiv);

        tempDiv.addEventListener("click", (e) => {
          this.handleCurrentId(item);
        });
      });
    } else {
      console.log(data);
    }
  },

  setRoomName() {
    document.querySelector(
      "body > div > div.mb > div.mbh > div > span"
    ).innerText = `room:${state.user}-${state.id}`;
    this.updateChatUserStatus(state.user);
  },

  updateChatUserStatus() {
    const ofs = document.querySelector(".cst");
    ofs.innerText = `${state.id} ${state.idStatus}`;
  },

  addMessageBodyChat(chat) {
    const messageBody = document.querySelector(".cb");
    let userLabel = chat.from === state.user ? "you" : chat.from;
    let classLabel = chat.from === state.user ? "to" : "fm";
    let msg = chat.message;
    let moment = new Date(chat.createdAt);
    moment = moment.toLocaleString();
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("cmb");
    messageDiv.classList.add(classLabel);
    let innerHTML = `
            <span>${msg}</span>
            <div class="ts">${userLabel}:${moment}</div>
        `;
    messageDiv.innerHTML = innerHTML;
    messageBody.append(messageDiv);
    this.scrollChatBodyBottom();
  },

  addMessageBodyChats(data) {
    try {
      const messageBody = document.querySelector(".cb");
      messageBody.innerHTML = "";
      data.chats.map((chat) => this.addMessageBodyChat(chat));
    } catch (e) {
      console.log(e);
    }
  },

  handleCurrentId(id) {
    state.setIsRoom(false);
    document.querySelector(".mb").style.opacity = "1";
    state.setCurrentId(id);
    this.addMessageBodyChats({ chats: [] });
    this.setRoomName();
    query.getChat();
  },

  raiseError(errMsg, time = 3000) {
    const errEle = document.querySelector(".err");
    var errMsgEle = document.createElement("span");
    errMsgEle.textContent = errMsg;
    errEle.append(errMsgEle);
    setTimeout(() => {
      errMsgEle.remove();
    }, time);
  },

  addNewUser(data) {
    if (data.success) {
      this.updateFriendsList({ success: true, data: { friends: data.data } });
    } else {
      this.raiseError(data.message);
    }
  },

  signOut(data) {
    if (data.success) {
      window.location.pathname = "/";
    } else {
      console.log("Something went wrong");
    }
  },

  putRoomChat(chat) {
    this.addMessageBodyChat(chat);
  },

  handleRoomJoin(roomId) {
    socket.addToRoom(roomId);
    state.id = roomId;
    document.querySelector(".mb").style.opacity = "1";
    this.setRoomName();
    this.addMessageBodyChats({ chats: [] });
    this.updateChatUserStatus();
  },

  localStream: null,
  remoteVideo: document.getElementById("remote-video"),
  localVideo: document.getElementById("local-video"),

  initVideo() {
    document.querySelector(
      "body > div > div.vc > div.vch > div > span"
    ).innerText = `call:${state.user}-${state.id}`;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        this.localVideo.srcObject = stream;
        socket.initPeer();
      });
    document.querySelector(".vcb").style.display = "none";
    document.querySelector(".vc").style.display = "grid";
    document.querySelector(".mb").style.width = "35%";
  },

  closeVideo() {
    document.querySelector(".vc").style.display = "none";
    document.querySelector(".mb").style.width = "70%";
    document.querySelector(".vcb").style.display = "block";
    document.querySelector(".vab").style.display = "none";
    try {
      this.localVideo.pause();
      this.localVideo.srcObject = null;
      let tracks = this.localStream.getTracks();
      for (let track of tracks) track.stop();
    } catch (err) {
      console.log(err.message);
    }
  },

  handleGetId(data) {
    console.log("handling getId", data);
    if (state.onCall) {
      socket.busyCall({
        to: data.from,
        from: state.id,
        message: `${state.id} in another call`,
      });
    } else {
      if (state.id !== data.from) {
        this.handleCurrentId(data.from);
      }
      this.initCall(data);
    }
  },

  handleResId(data) {
    console.log("handling resId", data);
    socket.callPeer(data.peerId);
  },

  initCall(data) {
    document.querySelector(".vcb").style.display = "none";
    document.querySelector(".vab").style.display = "block";
    this.raiseError(
      `Call from ${data.from}, Click Answer Call Btn to answer.`,
      10000
    );
    this.initVideo();
    document.querySelector(".vab").addEventListener("click", () => {
      document.querySelector(".vab").style.display = "none";
      socket.responseId({
        to: data.from,
        from: data.to,
        peerId: state.peerId,
      });
    });
  },

  requestId() {
    this.initVideo();
    socket.requestId({
      from: state.user,
      to: state.id,
    });
  },

  endCall() {
    this.closeVideo();
    socket.closePeer({
      to: state.id,
      from: state.user,
      message: `Call was closed by ${state.user}`,
    });
  },

  endCallRequest(data) {
    this.closeVideo();
    this.raiseError(data.message, 5000);
    socket.closePeerRequest();
  },
};

import state from "./state.js";
import query from "./query.js";
export default {
  init() {
    query.getFriends();
    this.addUserId();
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

  appendMessageBodyChat(chat) {
    const messageBody = document.querySelector(".cb");
    let userLabel = chat.from === state.user ? "you" : state.id;
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
  },

  addMessageBodyChats(data) {
    try {
      const messageBody = document.querySelector(".cb");
      messageBody.innerHTML = "";
      data.chats.map((chat) => this.appendMessageBodyChat(chat));
      this.scrollChatBodyBottom();
    } catch (e) {
      console.log(e);
    }
  },

  addMessageBodyChat(chat) {
    this.appendMessageBodyChat(chat);
    this.scrollChatBodyBottom();
  },

  handleCurrentId(id) {
    document.querySelector(".mb").style.opacity = "1";
    state.setCurrentId(id);
    this.addMessageBodyChats({ chats: [] }); // set loading gif or icon
    this.setRoomName();
    query.getChat();
  },

  raiseError(errMsg) {
    const errEle = document.querySelector(".err");
    var errMsgEle = document.createElement("span");
    errMsgEle.textContent = errMsg;
    errEle.append(errMsgEle);
    setTimeout(() => {
      errMsgEle.remove();
    }, 2000);
  },

  addNewUser(data) {
    if (data.success) {
      this.updateFriendsList(data);
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
};

import state from "./state.js";
import query from "./query.js";
export default {
  init() {
    query.getFriends();
    this.addUserId();
    this.handleCurrentId("ram001");
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
      const chatListDiv = document.querySelector(".f");
      chatListDiv.innerHTML = "<h3>Recent Chats</h3>";
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
    state.setCurrentId(id);
    this.setRoomName();
    query.getChat();
  },
};

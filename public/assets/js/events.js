import helper from "./helpers.js";
import query from "./query.js";
import state from "./state.js";
import socket from "./socket.js";

window.addEventListener("load", () => {
  query.initializeAll();

  document.querySelector(".inpis").addEventListener("click", (e) => {
    const msgInp = document.querySelector(".inpMsg");
    let message = msgInp.value;
    let msgJSON = {
      from: state.user,
      to: state.id,
      message: message,
      createdAt: new Date(),
    };
    state.isRoom ? helper.putRoomChat(msgJSON) : query.putChat(message);
    state.isRoom
      ? socket.emitRoomMessage(msgJSON)
      : socket.emitMessage(msgJSON);
    msgInp.value = "";
  });

  document.querySelector(".lb").addEventListener("click", () => {
    query.signOut();
  });

  document.querySelector(".is").addEventListener("click", () => {
    var newUserInp = document.querySelector(".nuinp");
    query.addUser(newUserInp.value);
    newUserInp.value = "";
  });

  document.querySelector(".ripis").addEventListener("click", () => {
    var roomInp = document.querySelector(".roomInp");
    state.setIsRoom(true);
    helper.handleRoomJoin(roomInp.value);
    roomInp.value = "";
  });
});

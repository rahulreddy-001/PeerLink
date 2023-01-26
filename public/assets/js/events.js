import helper from "./helpers.js";
import query from "./query.js";
import state from "./state.js";
import socket from "./socket.js";

const initializeAll = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  fetch("http://localhost:5000/api/user", requestOptions).then((response) =>
    response.json().then((data) => {
      state.setCurrentUser(data.user);
      helper.init();
      socket.init();
    })
  );
};
window.addEventListener("load", () => {
  initializeAll();

  document.querySelector(".inpis").addEventListener("click", (e) => {
    const msgInp = document.querySelector(
      "body > div > div.mb > div.inpm > input[type=text]"
    );
    let message = msgInp.value;
    query.putChat(message);
    socket.emitMessage({
      from: state.user,
      to: state.id,
      message: message,
      createdAt: new Date(),
    });
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
});

import state from "./state.js";
import helper from "./helpers.js";

window.addEventListener("load", () => {
  //   function testAPI() {}
  //   testAPI();
});
export default {
  async getFriends() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch("http://localhost:5000/api/friends", requestOptions).then(
      (response) =>
        response.json().then((data) => helper.updateFriendsList(data))
    );
  },

  async getChat() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`http://localhost:5000/api/chat/${state.id}`, requestOptions).then(
      (response) =>
        response.json().then((data) => helper.addMessageBodyChats(data))
    );
  },

  async putChat(msg) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      message: msg,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`http://localhost:5000/api/chat/${state.id}`, requestOptions).then(
      (response) =>
        response.json().then((data) => helper.addMessageBodyChats(data))
    );
  },

  async signOut() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch("http://localhost:5000/user/signout", requestOptions).then(
      (response) => response.json().then((data) => helper.signOut(data))
    );
  },

  async addUser(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      friend: id,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:5000/api/friends", requestOptions).then(
      (response) => response.json().then((data) => helper.addNewUser(data))
    );
  },
};

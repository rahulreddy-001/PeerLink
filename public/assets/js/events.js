import helper from "./helpers.js";
import query from "./query.js";

window.addEventListener("load", () => {
  helper.init();

  document.querySelector(".inpis").addEventListener("click", (e) => {
    const msgInp = document.querySelector(
      "body > div > div.mb > div.inpm > input[type=text]"
    );
    let message = msgInp.value;
    query.putChat(message);
    msgInp.value = "";
  });

  document.querySelector(".lb").addEventListener("click", () => {
    query.signOut((data) => {
      if (data.success) {
        window.location.pathname = "/";
      } else {
        console.log("Something went wrong");
      }
    });
  });
});

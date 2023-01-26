import helper from "./helpers.js";
export default {
  user: "",
  id: "",
  idStatus: "",
  isRoom: false,
  setCurrentUser(user) {
    this.user = user;
    helper.init();
  },
  setCurrentId(id) {
    this.id = id;
  },
  setIdStatus(status) {
    this.idStatus = status;
  },
  setIsRoom(status) {
    this.isRoom = status;
  },
};

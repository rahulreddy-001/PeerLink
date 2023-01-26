export default {
  user: window.localStorage.getItem("user"), //implement it
  id: "",
  idStatus: "",
  setCurrentUser(user) {
    this.user = user;
  },
  setCurrentId(id) {
    this.id = id;
  },
  setIdStatus(status) {
    this.idStatus = status;
  },
};

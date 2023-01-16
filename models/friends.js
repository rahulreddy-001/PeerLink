var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Friends = new Schema({
  username: {
    type: String,
    requried: true,
    unique: true,
  },
  friends: {
    type: [String],
  },
});

module.exports = mongoose.model("Friends", Friends);

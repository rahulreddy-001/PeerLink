var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Message = new Schema(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

var Chats = new Schema({
  name: {
    type: String,
    requried: true,
    unique: true,
  },
  chats: [Message],
});

module.exports = mongoose.model("Chats", Chats);

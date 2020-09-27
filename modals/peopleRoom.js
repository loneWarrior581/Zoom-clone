// saves the information regarding the room that is the name in the database for the session
// until the connection is broken
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model("user", roomSchema);
module.exports = Room;

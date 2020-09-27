require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const indexRouter = require("./routes/indexRouter");
const io = require("socket.io")(server); // for making rooms
const { v4: uuidv4 } = require("uuid"); //for creating the the random room id
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use(express.static("public"));
app.set("view engine", "pug");
app.use("/peerjs", peerServer);

mongoose
  .connect(process.env.MONGOURI, {
    dbName: "users", //giving the database name
    user: process.env.USER,
    pass: process.env.PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongodb connected...");
  })
  .catch(() => {
    console.log("Connection failed...");
  });

app.use("/", indexRouter);

// addind a mongoose connection

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    //this one listnes for the client and if any one joins the room a message is printerd in the console using the the socket.emit('join-room') on the client side
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 80, () => {
  console.log("the server started listning on the port 80");
});

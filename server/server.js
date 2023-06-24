//Create express
const express = require("express");
const server = express();
const http = require("http").Server(server);
const cors = require("cors");
server.use(cors());

const io = require("socket.io")(http, {
  cors: {
    // origin: ["http://localhost:3000", "http://192.168.0.17:3000/"],
    origin: "*",
  },
});

// in a middleware
io.use(async (socket, next) => {
  const username = socket.handshake.auth.username;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  console.log("user connected");
  // console.log(socket.username);
  let users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      messages: [],
      newMessageCounter: 0,
    });
  }

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
    messages: [],
    newMessageCounter: 0,
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
    console.log("user disconnected");
  });
  socket.on("private message", ({ content, to, from }) => {
    socket.to(to).emit("private message", {
      content,
      from: { username: from, userID: socket.id },
    });
  });
  socket.emit("users", users);
});

// Import Data-Base
const ConnectDB = require("./Database");

// Check if the database is connected ??
ConnectDB().then((connected) => {
  server.get("/", (req, res) => {
    if (connected) res.send("Connected");
    else {
      // NEED TO IMPLEMENT A STATIC HTML PAGE
      console.log("Not Connected");
      res.send("Not Connected");
    }
  });
});

const PORT = process.env.PORT || 5000;

// Import User methods
server.use("/user", require("./Routes/User"));

// Import User login
server.use("/user/login", require("./Routes/UserLogin"));

// Import Friendship methods
server.use("/user/friends", require("./Routes/Friends"));

// Listen on given port
http.listen(PORT, () => console.log("Server is Running ... " + PORT));

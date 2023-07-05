const express = require("express");
const server = express();
const http = require("http").Server(server);
const SessionModel = require("../Models/Session");
const UserModel = require("../Models/User");
const ConvoModel = require("../Models/Convo");

const io = require("socket.io")(http, {
  cors: {
    // origin: ["http://localhost:3000", "http://192.168.0.17:3000/"],
    origin: "*",
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

// in a middleware
io.use(async (socket, next) => {
  const username = socket.handshake.auth.username;
  const session = await SessionModel.findOne({ Username: username });
  socket.isNew = true;
  if (session) {
    socket.isNew = false;
    // find existing session
    socket.sessionID = session.SessionID;
    socket.userID = session.UserID;
    socket.username = session.Username;
    socket.newMessages = session.NewMessages;
    return next();
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", async (socket) => {
  const user = await UserModel.findOne({ Username: socket.username });
  if (socket.isNew && user) {
    let newMessages = [];
    user.Friends.forEach((friend) => {
      newMessages.push({
        Username: friend.Username,
        Counter: 0,
      });
    });
    // Create new session object
    const session = {
      Id: user._id,
      SessionID: socket.sessionID,
      UserID: socket.userID,
      Username: socket.username,
      NewMessages: newMessages,
      Connected: true,
    };
    try {
      const newSession = new SessionModel(session);
      // Save user to database
      await newSession.save();
    } catch (error) {
      console.log(error.message);
    }
  } else {
    await SessionModel.findOneAndUpdate(
      {
        SessionID: socket.sessionID,
      },
      { Connected: true }
    );
  }

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    // newMessages: socket.newMessages,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  try {
    if (user) {
      for (let i = 0; i < user.Friends.length; i++) {
        user.Friends[i] = user.Friends[i].Username;
      }
      const sessions = await SessionModel.find({
        Username: { $in: user.Friends },
      });
      sessions.forEach((session) => {
        socket.newMessages.forEach((item) => {
          if (item.Username === session.Username) {
            users.push({
              userID: session.UserID,
              username: session.Username,
              connected: session.Connected,
              newMessageCounter: item.Counter,
              messages: [],
            });
          }
        });
      });
    }
  } catch (error) {
    console.log(error);
  }

  await socket.emit("users", users);
  // notify existing users
  users.forEach((user) => {
    if (user.connected) {
      socket.to(user.userID).emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        messages: [],
        newMessageCounter: 0,
        connected: true,
      });
    }
  });

  socket.on("friend request", async ({ from, to }) => {
    const session = await SessionModel.findOne({ Username: from.username });
    socket.to(to.userID).emit("friend request accepted", {
      userID: session.UserID,
      username: session.Username,
      messages: [],
      newMessageCounter: 0,
      connected: session.Connected,
    });
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      await SessionModel.findOneAndUpdate(
        {
          SessionID: socket.sessionID,
        },
        { Connected: false }
      );
    }
  });

  socket.on("private message", async ({ content, to, from }) => {
    const username = socket.handshake.auth.username;
    await ConvoModel.findOneAndUpdate(
      {
        Users: { $all: [username, to.username] },
      },
      {
        $push: {
          Convo: {
            from: username,
            to: to.username,
            Message: content,
          },
        },
      }
    );
    const session = await SessionModel.findOne({ Username: to.username })
      .select("Connected")
      .select("NewMessages");
    if (session.Connected) {
      socket.to(to.userID).emit("private message", {
        content,
        from: { username: from, userID: socket.userID },
      });
    } else {
      let counter = -1;
      for (let i = 0; i < session.NewMessages.length; i++) {
        if (session.NewMessages[i].Username === from) {
          counter = session.NewMessages[i].Counter;
        }
      }
      counter = Number(counter) + 1;
      await SessionModel.findOneAndUpdate(
        {
          Username: to.username,
          NewMessages: { $elemMatch: { Username: from } },
        },
        { $set: { "NewMessages.$.Counter": counter } }
      );
    }
  });
  // socket.emit("users", users);
});

module.exports = { http, server };

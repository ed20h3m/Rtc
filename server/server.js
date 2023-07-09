//Create express
const { http, server } = require("./Routes/Socket");
const cors = require("cors");
const path = require("path");
const express = require("express");
server.use(cors());

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
server.use("/convos", require("./Routes/Convos"));

// Import Session Methods
server.use("/sessions", require("./Routes/Sessions"));

// Import User methods
server.use("/user", require("./Routes/User"));

// Import User login
server.use("/user/login", require("./Routes/UserLogin"));

// Import Friendship methods
server.use("/user/friends", require("./Routes/Friends"));

// Set port number
server.use(express.static(path.join(__dirname, "build")));

// Set port number
if (process.env.NODE_ENV === "production") {
  server.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
// Listen on given port
http.listen(PORT, () => console.log("Server is Running ... " + PORT));

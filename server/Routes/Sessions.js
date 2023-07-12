// Import Modules
const express = require("express");
const SessionModel = require("../Models/Session");
const UserAuthentication = require("../Middleware/UserAuthentication");
const Router = express.Router();
const { Session_Not_Found, Error, Success } = require("./Errors");
Router.use(express.json());

Router.post("/", UserAuthentication, async (req, res) => {
  // Destruct Username
  const { Username } = req.body;
  try {
    // Find session in Database
    const Session = await SessionModel.findOne({ Username: Username })
      .select("-NewMessages")
      .select("-created_at")
      .select("-updatedAt")
      .select("-_id")
      .select("-__v");
    const sesh = {
      userID: Session.UserID,
      username: Session.Username,
      connected: Session.Connected,
      newMessageCounter: 0,
      messages: [],
    };
    res.status(200).json({ Session: sesh, type: Success });
  } catch {
    res.status(404).json({ message: Session_Not_Found, type: Error });
  }
});
Router.put("/", async (req, res) => {});

module.exports = Router;

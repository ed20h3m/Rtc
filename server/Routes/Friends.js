// Import Modules
const express = require("express");
const Router = express.Router();

// Import Models
const UserModel = require("../Models/User");

// Import Authentication middleware
const UserAuthentication = require("../Middleware/UserAuthentication");

// Import Schemas
const { FriendShipSchema, RequestSchema } = require("../Schemas/User");

// Import Errors
const {
  Insufficient_Information,
  Error,
  User_Not_Found,
  Friend_Request_Sent,
  Success,
  Friend_Request_Already_Sent,
  Friend_Request_You,
  Friend_Request_Accepted,
  Friend_Request_Rejected,
  Friend_Removed,
} = require("./Errors");

// GET - Friends
Router.get("/", UserAuthentication, async (req, res) => {
  // const { Fields, User } = req.body;
  try {
    // get friends ids
    const user = await UserModel.findById(req.id);

    // Check if user has friends
    if (!user.Friends) return;

    for (let i = 0; i < user.Friends.length; i++) {
      user.Friends[i] = user.Friends[i].id;
    }
    const friends = await UserModel.find({ _id: { $in: user.Friends } })
      .select("Username")
      .select("Email")
      .select("Name");

    res.status(200).json({ Friends: friends, type: Success });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

// POST Create Friendship
Router.post("/", UserAuthentication, async (req, res) => {
  // Destruct User from request body
  const { User } = req.body;
  // Validate syntax and check user object exists
  const err = Validate(req.body, FriendShipSchema);

  if (err.type === Error)
    return res.status(err.code).json({ message: err.message, type: err.type });

  try {
    // set username to lower case
    User.Username = User.Username.toLowerCase();
    // find user based on username
    const user = await UserModel.findOne({
      Username: User.Username,
    })
      .select("_id")
      .select("Requested_Friends");

    // if user does not exist: return error message
    if (!user)
      return res.status(404).json({ message: User_Not_Found, type: Error });

    // Check request is not for the current user
    if (User.Username === req.Username)
      return res.status(404).json({ message: Friend_Request_You, type: Error });

    // Check if friend request is already sent
    let IsRequested = false;
    user.Requested_Friends.forEach((Friend) => {
      // If request exits return error message
      if (Friend.id === req.id) IsRequested = true;
    });
    if (IsRequested)
      return res
        .status(200)
        .json({ message: Friend_Request_Already_Sent, type: Error });

    // Create friendship

    // Update user who SENT request
    await UserModel.findByIdAndUpdate(req.id, {
      $push: {
        Requested_Friends: { id: user._id.toString(), DidYouSend: true },
      },
    });

    // Update user who RECEIVED request
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { Requested_Friends: { id: req.id, DidYouSend: false } },
    });

    // Send success response
    res.status(200).json({ message: Friend_Request_Sent, type: Success });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

// PUT Accept / Reject Friendship
Router.put("/", UserAuthentication, async (req, res) => {
  // Check if user has any friends
  if (req.User.Requested_Friends <= 0)
    return res.status(404).json({ message: Friend_Request_You, type: Error });

  // Destruct User from request body
  const { User } = req.body;
  // Validate syntax and check user object exists
  const err = Validate(req.body, RequestSchema);
  if (err.type === Error)
    return res.status(err.code).json({ message: err.message, type: err.type });

  // Convert username to lower case
  User.Username = User.Username.toLowerCase();

  // Check if the user exists based on username
  const user = await UserModel.findOne({ Username: User.Username })
    .select("_id")
    .select("Requested_Friends");

  // Return error if user does not exist
  if (!user)
    return res.status(404).json({ message: User_Not_Found, type: Error });

  let IsUser2FoundFriend = false;
  let IsUser1Request = false;
  try {
    // SENDER - ACCEPTING OR REJECTING
    req.User.Requested_Friends.forEach((friend) => {
      if (friend.id === user._id.toString() && !friend.DidYouSend) {
        IsUser2FoundFriend = true;
        return;
      }
    });

    // RECIPIENT
    user.Requested_Friends.forEach((friend) => {
      if (friend.id === req.id && friend.DidYouSend) IsUser1Request = true;
    });

    // Return error message if match not found
    if (!IsUser2FoundFriend || !IsUser1Request)
      return res.status(404).json({ message: Friend_Request_You, type: Error });

    // Filter Object
    const Filter1 = User.Request
      ? {
          $pull: {
            Requested_Friends: { id: user._id.toString(), DidYouSend: false },
          },
          $push: {
            Friends: { id: user._id.toString() },
          },
        }
      : {
          $pull: {
            Requested_Friends: { id: user._id.toString() },
          },
        };
    const Filter2 = User.Request
      ? {
          $pull: {
            Requested_Friends: { id: req.id.toString() },
          },
          $push: {
            Friends: { id: req.id.toString() },
          },
        }
      : {
          $pull: {
            Requested_Friends: { id: req.id.toString() },
          },
        };

    // Update user who SENT request
    await UserModel.findByIdAndUpdate(req.id, Filter1);
    // Update user who RECEIVED request
    await UserModel.findByIdAndUpdate(user._id, Filter2);

    // Send response message
    res.status(200).json({
      message: User.Request ? Friend_Request_Accepted : Friend_Request_Rejected,
      type: Success,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

// DELETE Friendship
Router.delete("/", UserAuthentication, async (req, res) => {
  // Check if user has any friends
  if (req.User.Friends <= 0)
    return res.status(404).json({ message: Friend_Request_You, type: Error });

  // Destruct User from request body
  const { User } = req.body;

  // Validate syntax and check user object exists
  const err = Validate(req.body, FriendShipSchema);
  if (err.type === Error)
    return res.status(err.code).json({ message: err.message, type: err.type });

  // Check request is not for the current user
  if (User.Username === req.Username)
    return res.status(404).json({ message: Friend_Request_You, type: Error });

  // Convert username to lower case
  User.Username = User.Username.toLowerCase();
  try {
    // Check if the user exists based on username
    const user = await UserModel.findOne({ Username: User.Username })
      .select("_id")
      .select("Friends");
    // Return error if user does not exist
    if (!user)
      return res.status(404).json({ message: User_Not_Found, type: Error });

    let IsUser2FoundFriend = false;
    let IsUser1Request = false;
    // SENDER - ACCEPTING OR REJECTING
    req.User.Friends.forEach((friend) => {
      if (friend.id === user._id.toString()) {
        IsUser2FoundFriend = true;
        return;
      }
    });

    // RECIPIENT
    user.Friends.forEach((friend) => {
      if (friend.id === req.id) IsUser1Request = true;
    });
    // Return error message if match not found
    if (!IsUser2FoundFriend || !IsUser1Request)
      return res.status(404).json({ message: Friend_Request_You, type: Error });

    // user._id = user._id.toString;
    await UserModel.findByIdAndUpdate(req.id, {
      $pull: {
        Friends: { id: user._id.toString() },
      },
    });
    // Update user who RECEIVED request
    await UserModel.findByIdAndUpdate(user._id, {
      $pull: {
        Friends: { id: req.id.toString() },
      },
    });
    res.status(200).json({ message: Friend_Removed, type: Success });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

// validate
const Validate = (Body, Schema) => {
  // Receive User object from a user
  const { User } = Body;

  // Check if user object exists
  if (!User)
    return { code: 404, message: Insufficient_Information, type: Error };

  // Check if there are any syntax / format errors
  const { error } = Schema.validate(User);

  // If error return message
  if (error)
    return {
      code: 400,
      message: error.details[0].message.replace(/"/g, ""),
      type: Error,
    };
  return { type: Success };
};

module.exports = Router;

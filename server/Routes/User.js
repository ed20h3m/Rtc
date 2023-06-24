// Import Modules
const express = require("express");
const Bcrypt = require("bcryptjs");

// Import Schemas
const {
  UserSchema,
  UserSchemaPut,
  UserSchemaPassword,
} = require("../Schemas/User");

// Import Models
const UserModel = require("../Models/User");
const UserAuthentication = require("../Middleware/UserAuthentication");

// Import error messages
const {
  Insufficient_Information,
  Email_Username_Taken,
  User_Not_Found,
  Error,
  Success,
  User_Created,
  User_Model_Updated,
  Password_Updated,
} = require("./Errors");

// Create a Router
const Router = express.Router();
Router.use(express.json());

// GET  Get user
Router.get("/", UserAuthentication, async (req, res) => {
  try {
    // Get user details from database
    const user = await UserModel.findById(req.id)
      .select("-Friends")
      .select("-Requested_Friends")
      .select("-created_at")
      .select("-updatedAt")
      .select("-Password")
      .select("-__v");
    // return user
    res.status(200).json({ user: user, type: Success });
  } catch {
    res.status(404).json({ type: User_Not_Found, type: Error });
  }
});

// POST  Create new user
Router.post("/", async (req, res) => {
  try {
    // Destruct User Object
    const { User } = req.body;
    // Check All Attributes: syntax and length

    //Check if the user object also exists
    if (!User)
      return res.status(400).json({
        message: Insufficient_Information,
        type: Error,
      });

    // Validate User object
    const { error } = UserSchema.validate(User);

    // Check if there is an error
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: Error,
      });

    // Check if user exists
    const { Exits } = await CheckUserExists(User);

    // if username or email exists return error
    if (Exits)
      return res
        .status(200)
        .json({ message: Email_Username_Taken, type: Error });

    // Encrypt password
    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(User.Password, salt);
    User.Password = hash;

    User.Email = User.Email.toLowerCase();
    User.Username = User.Username.toLowerCase();

    // Add friendship arrays to user object
    User.Friends = [];
    User.Requested_Friends = [];

    // Create new user model
    const saved = new UserModel(User);

    // Save user to database
    await saved.save();

    // respond with success message
    res.status(200).json({ message: User_Created, type: Success });
  } catch (error) {
    // respond with error message
    res.status(500).json({ message: error.message, type: Error });
  }
});

// PUT - Edit user
Router.put("/", UserAuthentication, async (req, res) => {
  try {
    // Destruct User Object
    const { User } = req.body;
    // Check All Attributes: syntax and length

    //Check if the user object also exists
    if (!User)
      return res.status(400).json({
        message: Insufficient_Information,
        type: Error,
      });

    // Validate User object
    const { error } = UserSchemaPut.validate(User);

    // Check if there is an error
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: Error,
      });

    // Check if username or email is taken
    if (User.Username || User.Email) {
      const { Exits, user } = await CheckUserExists(User);
      // if user exists and the details don't belong to them return error
      if (Exits && user._id.toString() !== req.id)
        return res
          .status(200)
          .json({ message: Email_Username_Taken, type: Error });
    }
    // Update user details
    const PreviousUser = await UserModel.findByIdAndUpdate(req.id, User);
    // check if user was updated
    if (!PreviousUser)
      return res.status(200).json({ message: User_Not_Found, type: Error });

    // respond with success message
    res.status(200).json({ message: User_Model_Updated, type: Success });
  } catch (error) {
    // respond with error message
    res.status(500).json({ message: error.message, type: Error });
  }
});

// PUT - change password
Router.put("/change-password", UserAuthentication, async (req, res) => {
  try {
    // Destruct User Object
    const { User } = req.body;
    // Check All Attributes: syntax and length

    //Check if the user object also exists
    if (!User)
      return res.status(400).json({
        message: Insufficient_Information,
        type: Error,
      });

    // Validate User object
    const { error } = UserSchemaPassword.validate(User);

    // Check if there is an error
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: Error,
      });

    // Created a hashed password
    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(User.Password, salt);
    User.Password = hash;

    // Updated password in database
    const user = await UserModel.findByIdAndUpdate(req.id, {
      Password: User.Password,
    });

    // Check if user was updated
    if (!user)
      return res.status(200).json({ message: User_Not_Found, type: Error });
    // respond with success message
    res.status(200).json({ message: Password_Updated, type: Success });
  } catch (error) {
    // respond with error message
    res.status(500).json({ message: error.message, type: Error });
  }
});

// Check user exits in Database
const CheckUserExists = async (UserObject) => {
  // Destruct User object
  const { Email, Username } = UserObject;

  // Check if there is a match to the username or email
  const user = await UserModel.findOne({
    $or: [{ Username: Username.toLowerCase() }, { Email: Email.toLowerCase() }],
  });
  // return true if user exists
  if (user) return { Exits: true, user: user };
  return { Exits: false };
};

module.exports = Router;

// Import all packages required
const express = require("express");
const app = express();
app.use(express.json());
const JWT = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");

// Import Models
const UserModel = require("../Models/User");
const { UserLoginSchema } = require("../Schemas/User");

app.post("/", async (req, res) => {
  // Destruct attributes from the request body
  const { User } = req.body;
  if (!User)
    return res.status(400).json({
      message: "Insufficient Information",
      type: "error",
    });

  // Check if there are any syntax errors
  const { error } = UserLoginSchema.validate(User);

  // Return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  try {
    // Check if the details are consistent with the database
    const { EmailUsername, Password } = User;
    const user = await UserModel.findOne({
      $or: [{ Email: EmailUsername }, { Username: EmailUsername }],
    });
    // If Customer not found return error
    if (!user)
      return res.status(400).json({
        message: "Incorrect Email/Username or Password. Try again!",
        type: "error",
      });
    // Check if password is correct
    const Correct = await Bcrypt.compare(Password, user.Password);
    // If password not correct return error
    if (!Correct)
      return res.status(400).json({
        message: "Incorrect Email/Username or Password. Try again!",
        type: "error",
      });
    // Generate a token for the user
    const Token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "5h",
    });

    // Respond with a token
    res.status(200).json({ Token: Token, type: "success" });
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = app;

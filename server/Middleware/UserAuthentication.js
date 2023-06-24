// Middleware function to check user authentication

// Import json web token
const JWT = require("jsonwebtoken");

// Import files
const UserModel = require("../Models/User");

// Authentication function
const UserAuthentication = async (req, res, next) => {
  // Store the token for the request header
  const Token = req.header("Token");

  // If there is no token return error
  if (!Token)
    return res.json({
      message: "Token Not Found",
      type: "error",
    });

  try {
    // Check if the token is valid
    const isActive = JWT.verify(Token, process.env.TOKEN_SECRET);
    req.id = isActive.id;

    // Update user details
    const user = await UserModel.findById(req.id);

    // check if user was updated
    if (!user)
      return res.status(200).json({ message: "user not found", type: "error" });

    req.Username = user.Username;
    req.User = user;
    next();
  } catch (error) {
    // If  error return error
    res.json({ message: error.message, type: "error" });
  }
};

module.exports = UserAuthentication;

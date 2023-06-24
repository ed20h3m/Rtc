const Mongoose = require("mongoose");

const UserSchema = Mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    Friends: {
      type: Array,
      required: true,
      default: [],
    },
    Requested_Friends: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = Mongoose.model("User", UserSchema, "User");

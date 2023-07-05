const Mongoose = require("mongoose");

const SessionSchema = Mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
    },
    UserID: {
      type: String,
      required: true,
    },
    SessionID: {
      type: String,
      required: true,
    },
    Connected: {
      type: Boolean,
      required: true,
    },
    NewMessages: {
      type: Array,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = Mongoose.model("Session", SessionSchema, "Session");

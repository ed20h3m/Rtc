const Mongoose = require("mongoose");

const ConvoSchema = Mongoose.Schema(
  {
    Users: {
      type: Array,
      required: true,
      default: [],
    },
    Convo: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = Mongoose.model("Convo", ConvoSchema, "Convo");

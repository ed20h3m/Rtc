// Import Modules
const express = require("express");
const ConvoModel = require("../Models/Convo");
const SessionModel = require("../Models/Session");
const Router = express.Router();
const { Error, Success } = require("./Errors");
Router.use(express.json());

Router.post("/", async (req, res) => {
  const { Users } = req.body;
  try {
    const convos = await ConvoModel.findOne({
      Users: { $all: Users },
    });
    if (convos) res.status(200).json({ convos: convos.Convo, type: Success });
    else res.status(400).json({ message: "Not Found", type: Error });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

Router.put("/", async (req, res) => {
  const { To, From } = req.body;
  try {
    const ret = await ResetCounter(To, From);
    res.status(200).json(ret);
  } catch (error) {
    res.status(500).json(ret);
  }
});

Router.put("/clear-convo", async (req, res) => {
  const { Me, Username } = req.body;

  try {
    await ConvoModel.findOneAndUpdate(
      {
        Users: { $all: [Me, Username] },
      },
      {
        Convo: [],
      }
    );
    await ResetCounter(Me, Username);
    res.status(200).json({ message: "Conversation Cleared", type: Success });
  } catch (error) {
    res.status(500).json({ message: error.message, type: Error });
  }
});

const ResetCounter = async (To, From) => {
  try {
    await SessionModel.findOneAndUpdate(
      {
        Username: From,
        NewMessages: { $elemMatch: { Username: To } },
      },
      { $set: { "NewMessages.$.Counter": 0 } }
    );
    return { message: "Counter Reset", type: Success };
  } catch (error) {
    return { message: error.message, type: Error };
  }
};

module.exports = Router;

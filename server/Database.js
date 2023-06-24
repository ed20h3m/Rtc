// This is where the database starts and a connection is established

// Import all required modules
const mongoose = require("mongoose");
require("dotenv").config();

//set the strictQuery option to true so unwanted data doesn't get stored in the database.
mongoose.set("strictQuery", true);

//Function: initiates the Database
const ConnectDB = async () => {
  // Flag to keep track of Database connection
  try {
    await mongoose.connect(process.env.DATA_BASE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Return true if database connected
    return true;
  } catch (error) {
    // Return false if database not connected
    return false;
  }
};

// Exports the Function to other modules to access
module.exports = ConnectDB;

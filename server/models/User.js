const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//More fields can be added or changed as needed by other tickets.
//from now on we will decide prior to starting the tickets what the names should be for the fields
const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

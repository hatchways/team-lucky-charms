const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//More fields can be added or changed as needed by other tickets.
//from now on we will decide prior to starting the tickets what the names should be for the fields
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    aboutMe: {
      type: String,
      default: '',
    },
    email: {
      type: String,
    },
    location: {
      type: String,
      default: 'Anywhere',
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    projects: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    ], //array of project id's for this user
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;

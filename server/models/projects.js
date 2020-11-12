const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 5, maxlength: 60 },
  subTitle: { type: String, required: true, minLength: 5, maxlength: 60 },
  description: { type: String, minlength: 5, maxlength: 255 },
  location: { type: String },
  industry: [{ type: mongoose.Schema.Types.ObjectId, ref: "Industry" }], // array of industry ID's from industry model
  images: { type: Array }, // array of image urls
  fundingGoal: { type: Number },
  isLive: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  investors: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
});

const Project = mongoose.model("Project", projectsSchema);

module.exports = Project;

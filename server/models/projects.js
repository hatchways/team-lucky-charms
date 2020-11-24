const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 5, maxlength: 60 },
  subtitle: { type: String, required: true, minLength: 5, maxlength: 60 },
  description: { type: String, minlength: 5 },
  location: { type: String },
  industry: { type: String },
  images: { type: Array }, // array of image urls
  fundingGoal: { type: Number },
  isLive: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  investors: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  ],
});

const Project = mongoose.model('Project', projectsSchema);

module.exports = Project;

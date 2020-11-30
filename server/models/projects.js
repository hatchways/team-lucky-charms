const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 5, maxlength: 60 },
    subtitle: { type: String, required: true, minLength: 5, maxlength: 60 },
    description: { type: String, minlength: 5, maxlength: 255 },
    location: { type: String },
    industry: { type: String },
    images: { type: Array }, // array of image urls
    deadline: { type: Date, default: '2021-01-31' },
    fundingGoal: { type: Number },
    isLive: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    investors: [
      {
        investorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          index: true,
        },
        amountFunded: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', projectsSchema);

module.exports = Project;

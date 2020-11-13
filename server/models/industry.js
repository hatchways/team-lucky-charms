const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["technology", "arts", "science", "music"],
    lowercase: true,
    trim: true,
  },
});

const Industry = mongoose.model(industrySchema);

module.exports = Industry;

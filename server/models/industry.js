const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Technology, Arts, Science, Music"],
  },
});

const Industry = mongoose.model(industrySchema);

module.exports = Industry;

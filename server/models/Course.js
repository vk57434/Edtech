const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  subject: String,
  class: Number
});

module.exports = mongoose.model("Course", CourseSchema);

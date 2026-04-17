const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  courseId: String,
  title: String,
  videoUrl: String
});

module.exports = mongoose.model("Lesson", LessonSchema);

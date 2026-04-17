const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  topic: String,
  class: Number,
  lessonTitle: String,
  lessonDescription: String,
  videoUrl: String,

  questions: [
    {
      text: String,

      options: [
        {
          text: String,
          imageUrl: String, // ⭐ NEW FIELD
        },
      ],

      correctIndex: Number,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);

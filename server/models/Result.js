const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  quizId: {   
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  class: Number,

  score: Number,

  total: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);

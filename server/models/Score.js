const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  userId: String,
  quizId: String,
  marks: Number
});

module.exports = mongoose.model("Score", ScoreSchema);

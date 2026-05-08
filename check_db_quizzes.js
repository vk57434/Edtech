const mongoose = require("mongoose");
const Quiz = require("./server/models/Quiz");
const dotenv = require("dotenv");

dotenv.config();

async function checkQuizzes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const quizzes = await Quiz.find().select("title topic class videoUrl").lean();
    console.log("Total Quizzes:", quizzes.length);
    console.log(JSON.stringify(quizzes, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkQuizzes();

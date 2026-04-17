const express = require("express");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result"); // ✅ ADD THIS

const router = express.Router();


// 🎯 Get quiz by class
router.get("/random/:class", async (req, res) => {
  try {
    const classLevel = Number(req.params.class);
    const topic = req.query.topic;

    let matchStage = { class: classLevel };

    // optional topic filter
    if (topic) {
      matchStage.topic = topic;
    }

    const quiz = await Quiz.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);

    if (!quiz.length) {
      return res.status(404).json({
        message: "No quiz found for this class",
      });
    }

    res.json(quiz[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ✅ SAVE QUIZ RESULT
router.post("/submit", async (req, res) => {
  try {
    const { studentId, quizId, class: studentClass, score, total } = req.body;

    // ✅ Strong validation
    if (!studentId || !quizId || !studentClass) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const result = await Result.create({
      studentId,
      quizId, 
      class: studentClass,
      score,
      total,
    });

    res.json({
      message: "✅ Score saved successfully",
      result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

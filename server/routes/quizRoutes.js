const express = require("express");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const Score = require("../models/Score"); // Import the Score model

const router = express.Router();

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// 🎯 Get quiz by class
router.get("/random/:class", async (req, res) => {
  try {
    const classLevel = Number(req.params.class);
    const topic = req.query.topic;

    console.log(`🔍 Fetching random quiz for Class: ${classLevel}, Topic: ${topic}`);

    let matchStage = { class: classLevel };

    // optional topic filter
    if (topic) {
      matchStage.topic = { $regex: new RegExp(escapeRegex(topic.trim()), "i") };
    }

    const adminQuiz = await Quiz.aggregate([
      { $match: { ...matchStage, adminCreated: true } },
      { $sample: { size: 1 } },
    ]);

    if (adminQuiz.length) {
      console.log(`✅ Found admin-created quiz: ${adminQuiz[0].topic} - ${adminQuiz[0]._id}`);
      return res.json(adminQuiz[0]);
    }

    if (topic) {
      const quiz = await Quiz.aggregate([
        { $match: matchStage },
        { $sample: { size: 1 } },
      ]);

      if (!quiz.length) {
        console.log(`❌ No quiz found for Class: ${classLevel}, Topic: ${topic}`);
        return res.status(404).json({
          message: "No quiz found for this topic and class",
        });
      }

      console.log(`✅ Found quiz: ${quiz[0].topic} - ${quiz[0]._id}`);
      return res.json(quiz[0]);
    }

    const quiz = await Quiz.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);

    if (!quiz.length) {
      console.log(`❌ No quiz found for Class: ${classLevel}, Topic: ${topic}`);
      return res.status(404).json({
        message: "No quiz found for this class",
      });
    }

    console.log(`✅ Found quiz: ${quiz[0].topic} - ${quiz[0]._id}`);
    res.json(quiz[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ✅ CREATE QUIZ (Admin)
router.post("/", async (req, res) => {
  try {
    const { title, topic, subject, class: classLevel, lessonTitle, lessonDescription, videoUrl, questions } = req.body;

    if (!topic || !classLevel || !questions?.length) {
      return res.status(400).json({
        message: "topic, class, and at least one question are required",
      });
    }

    const formattedQuestions = (questions || []).map((q) => ({
      text: q.text,
      correctIndex: Number(q.correctIndex || 0),
      options: (q.options || []).map((opt) => {
        if (typeof opt === "string") return { text: opt };
        return {
          text: opt.text || "",
          image: opt.image || "",
        };
      }),
    }));

    const quiz = await Quiz.create({
      title: title || `${topic} Quiz`,
      topic,
      subject: subject || "General",
      class: Number(classLevel),
      lessonTitle: lessonTitle || topic,
      lessonDescription: lessonDescription || "",
      videoUrl: videoUrl || "",
      questions: formattedQuestions,
      adminCreated: true,
    });

    res.status(201).json({
      message: "✅ Quiz created successfully",
      quiz,
    });
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

    // Create or update the Score document
    await Score.findOneAndUpdate(
      { studentId, quizId },
      { studentId, quizId, score, total },
      { upsert: true, new: true } // Create if not exists, return new document
    );

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

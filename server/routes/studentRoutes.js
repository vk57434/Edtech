const express = require("express");
const User = require("../models/User");
const Result = require("../models/Result");
const Score = require("../models/Score");
const Quiz = require("../models/Quiz");
const router = express.Router();

// Get student profile
router.get("/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId)
      .select("-password -studentPin")
      .lean();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student's quiz results
router.get("/:studentId/results", async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate("quizId", "title course")
      .lean();

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student's scores
router.get("/:studentId/scores", async (req, res) => {
  try {
    const scores = await Score.find({ studentId: req.params.studentId })
      .populate("quizId", "title")
      .lean();

    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student's subjects (derived from quizzes or by class fallback)
router.get("/:studentId/subjects", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).lean();
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const results = await Result.find({ studentId: req.params.studentId })
      .populate("quizId", "topic title")
      .lean();

    const subjects = new Set();
    const derive = (q) => {
      const s = (q?.topic || q?.title || "").toLowerCase();
      if (s.includes("math")) return "Math";
      if (s.includes("science")) return "Science";
      if (s.includes("english")) return "English";
      if (s.includes("social")) return "Social Studies";
      if (s.includes("evs")) return "EVS";
      return null;
    };

    results.forEach((r) => {
      const subj = derive(r.quizId);
      if (subj) subjects.add(subj);
    });

    if (subjects.size === 0) {
      const fallbackByClass = {
        1: ["Math", "English", "EVS"],
        2: ["Math", "English", "EVS"],
        3: ["Math", "English", "Science"],
        4: ["Math", "English", "Science"],
        5: ["Math", "English", "Science"],
      };
      return res.json({
        subjects: fallbackByClass[Number(student.class)] || [
          "Math",
          "Science",
          "English",
        ],
      });
    }

    res.json({ subjects: Array.from(subjects) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students (for admin purposes)
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password -studentPin")
      .lean();

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

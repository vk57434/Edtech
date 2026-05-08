const express = require("express");
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");

const router = express.Router();

router.get("/progress/:studentId", async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.params.studentId,
    }).populate("quizId", "topic");

    if (!results.length) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        passRate: 0,
        history: [],
        subjectAverages: {},
        weakSubjects: [],
      });
    }

    const totalQuizzes = results.length;

    // Calculate Average Score
    const averageScore =
      results.reduce((acc, r) => {
        return acc + (r.score / r.total) * 100;
      }, 0) / totalQuizzes;

    // Calculate Pass Rate
    const passed = results.filter(
      (r) => (r.score / r.total) * 100 >= 40
    ).length;
    const passRate = (passed / totalQuizzes) * 100;

    // Calculate Subject Averages
    const subjectStats = {};
    results.forEach((r) => {
      const topic = r.quizId?.topic || "General";
      if (!subjectStats[topic]) {
        subjectStats[topic] = { totalScore: 0, count: 0 };
      }
      subjectStats[topic].totalScore += (r.score / r.total) * 100;
      subjectStats[topic].count += 1;
    });

    const subjectAverages = {};
    const weakSubjects = [];
    Object.entries(subjectStats).forEach(([topic, stats]) => {
      const avg = Math.round(stats.totalScore / stats.count);
      subjectAverages[topic] = avg;
      if (avg < 50) {
        weakSubjects.push(topic);
      }
    });

    res.json({
      totalQuizzes,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      history: results,
      subjectAverages,
      weakSubjects,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

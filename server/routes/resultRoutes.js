const express = require("express");
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");

const router = express.Router();

router.get("/progress/:studentId", async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.params.studentId,
    })
      .populate("quizId", "topic title")
      .lean();

    //------------------------------------------------
    // NO QUIZ CASE
    //------------------------------------------------
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

    //------------------------------------------------
    // TOTAL QUIZZES
    //------------------------------------------------
    const totalQuizzes = results.length;

    //------------------------------------------------
    // AVERAGE %
    //------------------------------------------------
    const averageScore =
      results.reduce((acc, r) => {
        return acc + (r.score / r.total) * 100;
      }, 0) / totalQuizzes;

    //------------------------------------------------
    // PASS RATE
    //------------------------------------------------
    const passed = results.filter(
      (r) => (r.score / r.total) * 100 >= 40
    ).length;

    const passRate = (passed / totalQuizzes) * 100;

    //------------------------------------------------
    // SUBJECT-WISE PERFORMANCE
    //------------------------------------------------
    const subjectTotals = {};
    const subjectCounts = {};

    const deriveSubject = (quiz) => {
      const source = (quiz?.topic || quiz?.title || "").toLowerCase();
      if (source.includes("math")) return "Math";
      if (source.includes("science")) return "Science";
      if (source.includes("english")) return "English";
      if (source.includes("social")) return "Social Studies";
      if (source.includes("evs")) return "EVS";
      return "General";
    };

    results.forEach((r) => {
      const subject = deriveSubject(r.quizId);
      const pct = (r.score / r.total) * 100;
      subjectTotals[subject] = (subjectTotals[subject] || 0) + pct;
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });

    const subjectAverages = Object.fromEntries(
      Object.keys(subjectTotals).map((s) => [
        s,
        Math.round(subjectTotals[s] / subjectCounts[s]),
      ])
    );

    const weakSubjects = Object.entries(subjectAverages)
      .filter(([, avg]) => avg < 40)
      .map(([s]) => s);

    //------------------------------------------------
    res.json({
      totalQuizzes,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      history: results.map((r) => ({
        _id: r._id,
        score: r.score,
        total: r.total,
        createdAt: r.createdAt,
        subject: deriveSubject(r.quizId),
      })),
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

const express = require("express");
const User = require("../models/User");
const Result = require("../models/Result");
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" })
      .select("-password")
      .lean();

    const parentData = await Promise.all(
      parents.map(async (parent) => {
        const children = await User.find({ parentEmail: parent.email, role: "student" })
          .select("-password -studentPin")
          .lean();

        // Check if any child needs help
        const childrenWithStatus = await Promise.all(
          children.map(async (child) => {
            const results = await Result.find({ studentId: child._id });
            const avg = results.length
              ? results.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / results.length
              : 100; // Assume good if no tests taken yet
            return {
              ...child,
              needsHelp: avg < 50 && results.length > 0,
            };
          })
        );

        return { ...parent, children: childrenWithStatus };
      })
    );

    res.json({ parentData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

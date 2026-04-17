const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    // Get all parents
    const parents = await User.find({ role: "parent" })
      .select("-password -studentPin")
      .lean();

    // Get all students
    const students = await User.find({ role: "student" })
      .select("-password -studentPin")
      .lean();

    // Attach students to parents using parentEmail
    const parentData = parents.map(parent => {
      const children = students.filter(
        student => student.parentEmail === parent.email
      );

      return {
        ...parent,
        children,
      };
    });

    res.json({ parentData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

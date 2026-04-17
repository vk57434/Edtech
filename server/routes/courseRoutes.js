const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

router.post("/add", async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

module.exports = router;

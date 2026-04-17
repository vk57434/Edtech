const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ============================
   REGISTER (Student / Parent)
============================ */
router.post("/register", async (req, res) => {
  try {
    const { role } = req.body;

    if (role === "admin") {
      return res.status(403).json({ message: "Admin cannot self-register" });
    }

    const payload = {
      name: req.body.name,
      role,
    };

    if (role === "student") {
      const parent = await User.findOne({
        email: req.body.parentEmail,
        role: "parent",
      });

      if (!parent) {
        return res.status(400).json({ message: "Parent account not found" });
      }

      payload.class = Number(req.body.class);
      payload.parentEmail = req.body.parentEmail;
      payload.studentPin = String(req.body.studentPin || "").trim();
    }

    if (role === "parent") {
      payload.email = req.body.email;
      payload.password = req.body.password;
    }

    const user = await User.create(payload);
    res.status(201).json(user);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: err.message });
  }
});

/* ============================
   STUDENT LOGIN
============================ */
router.post("/student-login", async (req, res) => {
  try {
    const parentEmail = String(req.body.parentEmail || "").trim();
    const studentName = String(req.body.studentName || "").trim();
    const studentPin = String(req.body.studentPin || "").trim();

    if (!parentEmail || !studentName || !studentPin) {
      return res.status(400).json({ message: "Parent email, child name and PIN are required" });
    }

    const matchingStudents = await User.find({
      role: "student",
      parentEmail: { $regex: `^${parentEmail}$`, $options: "i" },
      name: { $regex: `^${studentName}$`, $options: "i" },
    });

    if (!matchingStudents.length) {
      return res.status(404).json({ message: "Child profile not found for this parent email" });
    }

    const studentWithPin = matchingStudents.find((student) => String(student.studentPin || "").trim());

    if (!studentWithPin) {
      return res.status(400).json({
        message: "Child PIN is not set yet. Please login as parent and create or reset the child PIN.",
      });
    }

    const student = await User.findOne({
      role: "student",
      parentEmail: { $regex: `^${parentEmail}$`, $options: "i" },
      name: { $regex: `^${studentName}$`, $options: "i" },
      studentPin,
    }).select("-password -studentPin");

    if (!student) {
      return res.status(401).json({ message: "Incorrect child PIN" });
    }

    return res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   UPDATE CHILD PIN
============================ */
router.patch("/student-pin", async (req, res) => {
  try {
    const parentEmail = String(req.body.parentEmail || "").trim();
    const studentId = String(req.body.studentId || "").trim();
    const studentPin = String(req.body.studentPin || "").trim();

    if (!parentEmail || !studentId || !studentPin) {
      return res.status(400).json({ message: "Parent email, child and new PIN are required" });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
      parentEmail,
    });

    if (!student) {
      return res.status(404).json({ message: "Child profile not found for this parent" });
    }

    student.studentPin = studentPin;
    await student.save();

    return res.status(200).json({ message: "Child PIN updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   LOGIN (Parent / Admin)
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 Parent login
    const parent = await User.findOne({
      email,
      password,
      role: "parent",
    });

    if (parent) {
      const students = await User.find({
        parentEmail: parent.email,
        role: "student",
      }).select("-password -studentPin");

      return res.status(200).json({
        _id: parent._id,
        name: parent.name,
        email: parent.email,
        role: "parent",
        students, // ✅ attached here
      });
    }

    // 🔐 Admin login
    const admin = await User.findOne({
      email,
      password,
      role: "admin",
    });

    if (admin) {
      return res.status(200).json(admin);
    }

    return res.status(401).json({ message: "Invalid email or password" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

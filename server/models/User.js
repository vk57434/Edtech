const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Parent & Admin only
  email: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === "parent" || this.role === "admin";
    },
  },

  password: {
    type: String,
    required: function () {
      return this.role === "parent" || this.role === "admin";
    },
  },

  role: {
    type: String,
    enum: ["student", "parent", "admin"],
    required: true,
  },

  // Student only (Class 1–5)
  class: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.role === "student";
    },
  },

  // Student only — multiple students can share same parent
  parentEmail: {
    type: String,
    required: function () {
      return this.role === "student";
    },
    index: true,
  },

  // Student only - a parent-controlled PIN enables login without child email.
  studentPin: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
});

module.exports = mongoose.model("User", UserSchema);

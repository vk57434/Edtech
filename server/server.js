const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const quizRoutes = require("./routes/quizRoutes");
const User = require("./models/User"); 
const seedCourses = require("./utils/seedCourses");
const seedClassOneLessons = require("./utils/seedClassOneLessons");


// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

const DEFAULT_ADMINS = [
  {
    name: "Admin VK",
    email: "vk57434@gmail.com",
    password: "admin123@",
  },
  {
    name: "Admin Pallawi",
    email: "pallawipratyay6@gmail.com",
    password: "pallawi123@",
  },
];

// 🔥 CREATE OR SYNC DEFAULT ADMINS
const createDefaultAdmins = async () => {
  try {
    for (const admin of DEFAULT_ADMINS) {
      const adminExists = await User.findOne({
        email: admin.email,
        role: "admin",
      });

      if (!adminExists) {
        await User.create({
          name: admin.name,
          email: admin.email,
          password: admin.password,
          role: "admin",
        });
        console.log(`✅ Default admin created: ${admin.email}`);
      } else {
        adminExists.name = admin.name;
        adminExists.password = admin.password;
        adminExists.role = "admin";
        await adminExists.save();
        console.log(`🔄 Admin synced: ${admin.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error creating default admins:", err.message);
  }
};

// Call admin creation
createDefaultAdmins();

// Routes
seedCourses();
seedClassOneLessons();
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/ai", require("./routes/aiQuizRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

// Port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

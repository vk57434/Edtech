const Course = require("../models/Course");

const seedCourses = async () => {

  const count = await Course.countDocuments();

  if (count > 0) {
    console.log("✅ Courses already exist");
    return;
  }

  await Course.insertMany([
    {
      title: "Fun Math",
      description: "Learn numbers with games",
      image: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
      classLevels: [1,2,3]
    },
    {
      title: "Basic Science",
      description: "Discover the world",
      image: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
      classLevels: [1,2,3]
    },
    {
      title: "English Skills",
      description: "Improve reading & writing",
      image: "https://cdn-icons-png.flaticon.com/512/2436/2436874.png",
      classLevels: [1,2,3]
    },
    {
      title: "Drawing",
      description: "Boost creativity",
      image: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
      classLevels: [1,2]
    }
  ]);

  console.log("🔥 Courses Seeded!");
};

module.exports = seedCourses;

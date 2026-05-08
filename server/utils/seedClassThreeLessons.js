const Quiz = require("../models/Quiz");

const seedClassThreeLessons = async () => {
  // Clear existing Class 3 quizzes
  await Quiz.deleteMany({ class: 3 });
  console.log("🧹 Cleared old Class 3 quizzes");

  const CLASS_THREE_LESSONS = [
    {
      title: "Multiplication & Addition",
      topic: "Multiplication",
      class: 3,
      lessonTitle: "Multiplication and Addition [Hindi]",
      lessonDescription: "Learn how multiplication is related to repeated addition in Hindi.",
      videoUrl: "https://www.youtube.com/embed/yEILEZsmZes",
      questions: [
        { text: "What is 3 x 4?", options: [{ text: "7" }, { text: "12" }, { text: "10" }, { text: "15" }], correctIndex: 1 },
        { text: "What is 5 + 5 + 5 the same as?", options: [{ text: "5 x 3" }, { text: "5 x 2" }, { text: "5 x 5" }, { text: "5 + 3" }], correctIndex: 0 },
        { text: "What is 2 x 8?", options: [{ text: "10" }, { text: "16" }, { text: "14" }, { text: "18" }], correctIndex: 1 },
        { text: "What is 4 + 4 + 4 + 4?", options: [{ text: "4 x 4" }, { text: "4 x 3" }, { text: "12" }, { text: "20" }], correctIndex: 0 },
        { text: "What is 6 x 2?", options: [{ text: "8" }, { text: "12" }, { text: "10" }, { text: "14" }], correctIndex: 1 },
        { text: "What is 0 x 10?", options: [{ text: "0" }, { text: "10" }, { text: "1" }, { text: "100" }], correctIndex: 0 },
        { text: "What is 1 x 9?", options: [{ text: "1" }, { text: "9" }, { text: "10" }, { text: "0" }], correctIndex: 1 },
        { text: "What is 3 + 3?", options: [{ text: "3 x 2" }, { text: "3 x 3" }, { text: "9" }, { text: "5" }], correctIndex: 0 },
        { text: "What is 7 x 3?", options: [{ text: "10" }, { text: "21" }, { text: "20" }, { text: "25" }], correctIndex: 1 },
        { text: "What is 10 x 2?", options: [{ text: "12" }, { text: "20" }, { text: "100" }, { text: "2" }], correctIndex: 1 },
      ],
    },
    {
      title: "4-Digit Addition",
      topic: "Addition",
      class: 3,
      lessonTitle: "Addition of 4-digit numbers (Hindi)",
      lessonDescription: "Learn how to add big 4-digit numbers step by step.",
      videoUrl: "https://www.youtube.com/embed/owVaGxS_tqU",
      questions: [
        { text: "What is 1000 + 2000?", options: [{ text: "3000" }, { text: "4000" }, { text: "2500" }, { text: "3500" }], correctIndex: 0 },
        { text: "What is 1234 + 1111?", options: [{ text: "2345" }, { text: "2222" }, { text: "3456" }, { text: "2344" }], correctIndex: 0 },
        { text: "What is 5000 + 5000?", options: [{ text: "9000" }, { text: "10000" }, { text: "11000" }, { text: "5500" }], correctIndex: 1 },
        { text: "What is 4321 + 0?", options: [{ text: "0" }, { text: "4321" }, { text: "4322" }, { text: "4320" }], correctIndex: 1 },
        { text: "What is 2000 + 300?", options: [{ text: "2300" }, { text: "2003" }, { text: "5000" }, { text: "2030" }], correctIndex: 0 },
        { text: "What is 1500 + 1500?", options: [{ text: "2000" }, { text: "3000" }, { text: "2500" }, { text: "4000" }], correctIndex: 1 },
        { text: "What is 9000 + 100?", options: [{ text: "9001" }, { text: "9100" }, { text: "10000" }, { text: "9010" }], correctIndex: 1 },
        { text: "What is 6000 + 4000?", options: [{ text: "9000" }, { text: "10000" }, { text: "11000" }, { text: "1000" }], correctIndex: 1 },
        { text: "What is 1111 + 2222?", options: [{ text: "3333" }, { text: "4444" }, { text: "2222" }, { text: "1234" }], correctIndex: 0 },
        { text: "What is 8000 + 500?", options: [{ text: "8005" }, { text: "8500" }, { text: "9000" }, { text: "8050" }], correctIndex: 1 },
      ],
    },
    {
      title: "Clock & Time",
      topic: "Time",
      class: 3,
      lessonTitle: "Clock Reading (Hindi)",
      lessonDescription: "Learn how to read the clock and tell time in Hindi.",
      videoUrl: "https://www.youtube.com/embed/yL6q6_XESA8",
      questions: [
        { text: "How many minutes are in one hour?", options: [{ text: "30" }, { text: "60" }, { text: "12" }, { text: "24" }], correctIndex: 1 },
        { text: "What does the short hand on a clock show?", options: [{ text: "Minutes" }, { text: "Hours" }, { text: "Seconds" }, { text: "Days" }], correctIndex: 1 },
        { text: "If the big hand is on 6, it is?", options: [{ text: "O'clock" }, { text: "Half past" }, { text: "Quarter past" }, { text: "Quarter to" }], correctIndex: 1 },
        { text: "How many hours are in a day?", options: [{ text: "12" }, { text: "24" }, { text: "60" }, { text: "7" }], correctIndex: 1 },
        { text: "If the big hand is on 12, it is?", options: [{ text: "Half past" }, { text: "O'clock" }, { text: "Quarter past" }, { text: "Quarter to" }], correctIndex: 1 },
        { text: "How many seconds are in a minute?", options: [{ text: "30" }, { text: "60" }, { text: "100" }, { text: "12" }], correctIndex: 1 },
        { text: "What time is it when both hands are on 12?", options: [{ text: "6:00" }, { text: "12:00" }, { text: "12:30" }, { text: "1:00" }], correctIndex: 1 },
        { text: "What do we use to measure time?", options: [{ text: "Ruler" }, { text: "Clock" }, { text: "Scale" }, { text: "Thermometer" }], correctIndex: 1 },
        { text: "How many days are in a week?", options: [{ text: "5" }, { text: "6" }, { text: "7" }, { text: "8" }], correctIndex: 2 },
        { text: "What comes after Monday?", options: [{ text: "Sunday" }, { text: "Wednesday" }, { text: "Tuesday" }, { text: "Friday" }], correctIndex: 2 },
      ],
    },
    {
      title: "Geometric Shapes",
      topic: "Geometry",
      class: 3,
      lessonTitle: "Geometric Shapes Video (Hindi)",
      lessonDescription: "Learn about different geometric shapes in Hindi.",
      videoUrl: "https://www.youtube.com/embed/Oac0YbfuByo",
      questions: [
        { text: "How many sides does a triangle have?", options: [{ text: "3" }, { text: "4" }, { text: "5" }, { text: "0" }], correctIndex: 0 },
        { text: "Which shape has no corners?", options: [{ text: "Square" }, { text: "Circle" }, { text: "Triangle" }, { text: "Rectangle" }], correctIndex: 1 },
        { text: "How many sides does a square have?", options: [{ text: "3" }, { text: "4" }, { text: "5" }, { text: "6" }], correctIndex: 1 },
        { text: "A rectangle has how many corners?", options: [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }], correctIndex: 2 },
        { text: "Which shape looks like a ball?", options: [{ text: "Cube" }, { text: "Sphere" }, { text: "Cone" }, { text: "Cylinder" }], correctIndex: 1 },
        { text: "A die (for Ludo) is in the shape of a?", options: [{ text: "Sphere" }, { text: "Cube" }, { text: "Cone" }, { text: "Cylinder" }], correctIndex: 1 },
        { text: "An ice cream cone is shaped like a?", options: [{ text: "Sphere" }, { text: "Cube" }, { text: "Cone" }, { text: "Circle" }], correctIndex: 2 },
        { text: "All sides of a square are?", options: [{ text: "Different" }, { text: "Equal" }, { text: "Longer" }, { text: "Shorter" }], correctIndex: 1 },
        { text: "How many corners does a circle have?", options: [{ text: "1" }, { text: "4" }, { text: "0" }, { text: "Infinite" }], correctIndex: 2 },
        { text: "Which shape has 4 sides but only opposite sides are equal?", options: [{ text: "Square" }, { text: "Rectangle" }, { text: "Triangle" }, { text: "Circle" }], correctIndex: 1 },
      ],
    },
    {
      title: "Money Conversion",
      topic: "Money",
      class: 3,
      lessonTitle: "Conversion of Money (Hindi)",
      lessonDescription: "Learn how to convert and count money in Hindi.",
      videoUrl: "https://www.youtube.com/embed/kRklXAbCFq0",
      questions: [
        { text: "How many paise are in 1 Rupee?", options: [{ text: "50" }, { text: "100" }, { text: "10" }, { text: "500" }], correctIndex: 1 },
        { text: "What is the symbol for Indian Rupee?", options: [{ text: "$" }, { text: "₹" }, { text: "£" }, { text: "€" }], correctIndex: 1 },
        { text: "How many 50 paise coins make 1 Rupee?", options: [{ text: "1" }, { text: "2" }, { text: "4" }, { text: "5" }], correctIndex: 1 },
        { text: "If you have two ₹10 notes, how much do you have?", options: [{ text: "₹10" }, { text: "₹20" }, { text: "₹30" }, { text: "₹100" }], correctIndex: 1 },
        { text: "₹5 + ₹5 = ?", options: [{ text: "₹10" }, { text: "₹15" }, { text: "₹55" }, { text: "₹20" }], correctIndex: 0 },
        { text: "How many ₹1 coins make ₹5?", options: [{ text: "1" }, { text: "5" }, { text: "10" }, { text: "2" }], correctIndex: 1 },
        { text: "If you buy a toy for ₹15 and give ₹20, how much change do you get?", options: [{ text: "₹2" }, { text: "₹5" }, { text: "₹10" }, { text: "₹0" }], correctIndex: 1 },
        { text: "Which note is blue in color?", options: [{ text: "₹10" }, { text: "₹50" }, { text: "₹2000" }, { text: "₹100" }], correctIndex: 1 },
        { text: "How do we write 'five rupees and fifty paise'?", options: [{ text: "₹5.50" }, { text: "₹55.0" }, { text: "₹50.5" }, { text: "₹5.05" }], correctIndex: 0 },
        { text: "What is 100 paise + 100 paise?", options: [{ text: "₹1" }, { text: "₹2" }, { text: "₹10" }, { text: "₹100" }], correctIndex: 1 },
      ],
    },
    {
      title: "Math: Patterns",
      topic: "Patterns",
      class: 3,
      lessonTitle: "Patterns Fun",
      lessonDescription: "Discover fun patterns in shapes and numbers in Hindi.",
      videoUrl: "https://www.youtube.com/embed/oKCWDc152x4",
      questions: [
        { text: "What comes next in: 2, 4, 6, 8, ...?", options: [{ text: "9" }, { text: "10" }, { text: "12" }, { text: "14" }], correctIndex: 1 },
        { text: "What comes next in: Circle, Square, Circle, Square, ...?", options: [{ text: "Triangle" }, { text: "Circle" }, { text: "Square" }, { text: "Star" }], correctIndex: 1 },
        { text: "What is next: A, B, A, B, ...?", options: [{ text: "C" }, { text: "A" }, { text: "B" }, { text: "D" }], correctIndex: 1 },
        { text: "What is next: 5, 10, 15, 20, ...?", options: [{ text: "21" }, { text: "25" }, { text: "30" }, { text: "35" }], correctIndex: 1 },
        { text: "Complete: Up, Down, Up, Down, ...?", options: [{ text: "Left" }, { text: "Up" }, { text: "Right" }, { text: "Down" }], correctIndex: 1 },
        { text: "What is next: 10, 20, 30, 40, ...?", options: [{ text: "41" }, { text: "50" }, { text: "60" }, { text: "100" }], correctIndex: 1 },
        { text: "What is next: 🍎, 🍌, 🍎, 🍌, ...?", options: [{ text: "🍇" }, { text: "🍎" }, { text: "🍌" }, { text: "🍊" }], correctIndex: 1 },
        { text: "What is next: 1, 3, 5, 7, ...?", options: [{ text: "8" }, { text: "9" }, { text: "10" }, { text: "11" }], correctIndex: 1 },
        { text: "Complete the pattern: Red, Blue, Red, Blue, ...?", options: [{ text: "Green" }, { text: "Red" }, { text: "Yellow" }, { text: "Blue" }], correctIndex: 1 },
        { text: "What is next: 100, 90, 80, 70, ...?", options: [{ text: "60" }, { text: "50" }, { text: "75" }, { text: "65" }], correctIndex: 0 },
      ],
    },
  ];

  await Quiz.insertMany(CLASS_THREE_LESSONS);
  console.log("🔥 Class 3 lessons seeded successfully with text-only options!");
};

module.exports = seedClassThreeLessons;

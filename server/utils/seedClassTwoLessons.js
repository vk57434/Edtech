const Quiz = require("../models/Quiz");

const seedClassTwoLessons = async () => {
  // Clear existing Class 2 quizzes
  await Quiz.deleteMany({ class: 2 });
  console.log("🧹 Cleared old Class 2 quizzes");

  const CLASS_TWO_LESSONS = [
    {
      title: "Double-Digit Addition",
      topic: "Addition",
      class: 2,
      lessonTitle: "Adding Big Numbers",
      lessonDescription: "Learn how to add two-digit numbers together easily!",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=0",
      questions: [
        { text: "What is 10 + 10?", options: [{ text: "15" }, { text: "20" }, { text: "25" }, { text: "30" }], correctIndex: 1 },
        { text: "What is 25 + 12?", options: [{ text: "35" }, { text: "37" }, { text: "40" }, { text: "42" }], correctIndex: 1 },
        { text: "What is 15 + 15?", options: [{ text: "20" }, { text: "25" }, { text: "30" }, { text: "35" }], correctIndex: 2 },
        { text: "What is 20 + 30?", options: [{ text: "40" }, { text: "50" }, { text: "60" }, { text: "70" }], correctIndex: 1 },
        { text: "What is 11 + 22?", options: [{ text: "30" }, { text: "33" }, { text: "35" }, { text: "44" }], correctIndex: 1 },
        { text: "What is 40 + 5?", options: [{ text: "40" }, { text: "45" }, { text: "50" }, { text: "55" }], correctIndex: 1 },
        { text: "What is 50 + 50?", options: [{ text: "80" }, { text: "90" }, { text: "100" }, { text: "110" }], correctIndex: 2 },
        { text: "What is 12 + 13?", options: [{ text: "20" }, { text: "25" }, { text: "30" }, { text: "35" }], correctIndex: 1 },
        { text: "What is 21 + 10?", options: [{ text: "30" }, { text: "31" }, { text: "32" }, { text: "33" }], correctIndex: 1 },
        { text: "What is 33 + 33?", options: [{ text: "60" }, { text: "63" }, { text: "66" }, { text: "69" }], correctIndex: 2 },
      ],
    },
    {
      title: "Double-Digit Subtraction",
      topic: "Subtraction",
      class: 2,
      lessonTitle: "Subtracting Big Numbers",
      lessonDescription: "Learn how to subtract two-digit numbers step by step.",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=803",
      questions: [
        { text: "What is 20 - 10?", options: [{ text: "5" }, { text: "10" }, { text: "15" }, { text: "20" }], correctIndex: 1 },
        { text: "What is 45 - 15?", options: [{ text: "25" }, { text: "30" }, { text: "35" }, { text: "40" }], correctIndex: 1 },
        { text: "What is 30 - 5?", options: [{ text: "20" }, { text: "25" }, { text: "30" }, { text: "35" }], correctIndex: 1 },
        { text: "What is 50 - 20?", options: [{ text: "20" }, { text: "30" }, { text: "40" }, { text: "50" }], correctIndex: 1 },
        { text: "What is 15 - 10?", options: [{ text: "2" }, { text: "5" }, { text: "10" }, { text: "15" }], correctIndex: 1 },
        { text: "What is 99 - 9?", options: [{ text: "80" }, { text: "90" }, { text: "99" }, { text: "100" }], correctIndex: 1 },
        { text: "What is 25 - 12?", options: [{ text: "10" }, { text: "12" }, { text: "13" }, { text: "15" }], correctIndex: 2 },
        { text: "What is 40 - 40?", options: [{ text: "0" }, { text: "1" }, { text: "10" }, { text: "40" }], correctIndex: 0 },
        { text: "What is 66 - 33?", options: [{ text: "22" }, { text: "33" }, { text: "44" }, { text: "55" }], correctIndex: 1 },
        { text: "What is 80 - 10?", options: [{ text: "60" }, { text: "70" }, { text: "80" }, { text: "90" }], correctIndex: 1 },
      ],
    },
    {
      title: "Place Values",
      topic: "Place Value",
      class: 2,
      lessonTitle: "Understanding Tens and Ones",
      lessonDescription: "Discover how numbers are made of tens and ones.",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=1377",
      questions: [
        { text: "In the number 34, which digit is in the tens place?", options: [{ text: "3" }, { text: "4" }, { text: "30" }, { text: "40" }], correctIndex: 0 },
        { text: "What is the value of 5 in the number 52?", options: [{ text: "5" }, { text: "50" }, { text: "2" }, { text: "20" }], correctIndex: 1 },
        { text: "How many tens are in the number 70?", options: [{ text: "0" }, { text: "7" }, { text: "70" }, { text: "10" }], correctIndex: 1 },
        { text: "Which number has 2 tens and 5 ones?", options: [{ text: "2" }, { text: "5" }, { text: "25" }, { text: "52" }], correctIndex: 2 },
        { text: "In 81, what is the ones digit?", options: [{ text: "1" }, { text: "8" }, { text: "10" }, { text: "80" }], correctIndex: 0 },
        { text: "What is 4 tens and 0 ones?", options: [{ text: "4" }, { text: "40" }, { text: "44" }, { text: "0" }], correctIndex: 1 },
        { text: "In 19, the 1 stands for?", options: [{ text: "1" }, { text: "10" }, { text: "9" }, { text: "19" }], correctIndex: 1 },
        { text: "Which is greater: 3 tens or 20 ones?", options: [{ text: "3 tens" }, { text: "20 ones" }, { text: "They are equal" }, { text: "Neither" }], correctIndex: 0 },
        { text: "What is the place value of 9 in 95?", options: [{ text: "Ones" }, { text: "Tens" }, { text: "Hundreds" }, { text: "Zero" }], correctIndex: 1 },
        { text: "How do you write 'six tens and two ones'?", options: [{ text: "6" }, { text: "2" }, { text: "62" }, { text: "26" }], correctIndex: 2 },
      ],
    },
    {
      title: "Basic Multiplication",
      topic: "Multiplication",
      class: 2,
      lessonTitle: "Introduction to Multiplication",
      lessonDescription: "Learn how multiplication is just repeated addition!",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=1947",
      questions: [
        { text: "What is 2 times 3 (2 x 3)?", options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "7" }], correctIndex: 2 },
        { text: "What is 5 times 2 (5 x 2)?", options: [{ text: "8" }, { text: "10" }, { text: "12" }, { text: "15" }], correctIndex: 1 },
        { text: "What is 3 x 3?", options: [{ text: "6" }, { text: "7" }, { text: "8" }, { text: "9" }], correctIndex: 3 },
        { text: "What is 4 x 1?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctIndex: 3 },
        { text: "What is 10 x 0?", options: [{ text: "0" }, { text: "1" }, { text: "10" }, { text: "100" }], correctIndex: 0 },
        { text: "2 + 2 + 2 is the same as?", options: [{ text: "2 x 2" }, { text: "2 x 3" }, { text: "2 x 4" }, { text: "3 x 3" }], correctIndex: 1 },
        { text: "What is 1 x 5?", options: [{ text: "1" }, { text: "5" }, { text: "10" }, { text: "15" }], correctIndex: 1 },
        { text: "What is 2 x 4?", options: [{ text: "6" }, { text: "8" }, { text: "10" }, { text: "12" }], correctIndex: 1 },
        { text: "What is 3 x 2?", options: [{ text: "5" }, { text: "6" }, { text: "7" }, { text: "8" }], correctIndex: 1 },
        { text: "What is 4 x 2?", options: [{ text: "6" }, { text: "8" }, { text: "10" }, { text: "12" }], correctIndex: 1 },
      ],
    },
    {
      title: "Basic Division",
      topic: "Division",
      class: 2,
      lessonTitle: "Sharing Equally with Division",
      lessonDescription: "Learn how to divide things into equal groups.",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=2721",
      questions: [
        { text: "If you have 6 cookies and share them between 2 friends, how many does each get?", options: [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "6" }], correctIndex: 1 },
        { text: "What is 10 divided by 2 (10 ÷ 2)?", options: [{ text: "2" }, { text: "4" }, { text: "5" }, { text: "10" }], correctIndex: 2 },
        { text: "What is 4 ÷ 2?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctIndex: 1 },
        { text: "What is 8 ÷ 2?", options: [{ text: "2" }, { text: "4" }, { text: "6" }, { text: "8" }], correctIndex: 1 },
        { text: "What is 9 ÷ 3?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctIndex: 2 },
        { text: "If you have 12 apples and 3 baskets, how many per basket?", options: [{ text: "3" }, { text: "4" }, { text: "5" }, { text: "6" }], correctIndex: 1 },
        { text: "What is 5 ÷ 1?", options: [{ text: "1" }, { text: "5" }, { text: "10" }, { text: "0" }], correctIndex: 1 },
        { text: "What is 20 ÷ 2?", options: [{ text: "5" }, { text: "10" }, { text: "15" }, { text: "20" }], correctIndex: 1 },
        { text: "What is 15 ÷ 3?", options: [{ text: "3" }, { text: "5" }, { text: "7" }, { text: "10" }], correctIndex: 1 },
        { text: "What is 10 ÷ 5?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "5" }], correctIndex: 1 },
      ],
    },
    {
      title: "Fractions Fun",
      topic: "Fractions",
      class: 2,
      lessonTitle: "Introduction to Fractions",
      lessonDescription: "Learn about halves, quarters, and parts of a whole.",
      videoUrl: "https://www.youtube.com/embed/6t3DMk4-9KU?start=3503",
      questions: [
        { text: "What is half of a pizza?", options: [{ text: "1/2" }, { text: "1/4" }, { text: "1/3" }, { text: "1/1" }], correctIndex: 0 },
        { text: "If you cut a cake into 4 equal pieces, what is one piece called?", options: [{ text: "A half" }, { text: "A quarter (1/4)" }, { text: "A third" }, { text: "A whole" }], correctIndex: 1 },
        { text: "What is 1/3?", options: [{ text: "One half" }, { text: "One third" }, { text: "One quarter" }, { text: "One whole" }], correctIndex: 1 },
        { text: "Two halves make a?", options: [{ text: "Quarter" }, { text: "Whole" }, { text: "Third" }, { text: "Half" }], correctIndex: 1 },
        { text: "What is the top number of a fraction called?", options: [{ text: "Numerator" }, { text: "Denominator" }, { text: "Sum" }, { text: "Total" }], correctIndex: 0 },
        { text: "What is the bottom number of a fraction called?", options: [{ text: "Numerator" }, { text: "Denominator" }, { text: "Difference" }, { text: "Product" }], correctIndex: 1 },
        { text: "Four quarters (1/4 + 1/4 + 1/4 + 1/4) make?", options: [{ text: "Half" }, { text: "Whole" }, { text: "Two" }, { text: "Three" }], correctIndex: 1 },
        { text: "Which is bigger: 1/2 or 1/4?", options: [{ text: "1/2" }, { text: "1/4" }, { text: "They are same" }, { text: "Neither" }], correctIndex: 0 },
        { text: "If you have 1/2 of a cookie, how many parts is the cookie cut into?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctIndex: 1 },
        { text: "How do you write 'one out of four' as a fraction?", options: [{ text: "1/2" }, { text: "1/3" }, { text: "1/4" }, { text: "4/1" }], correctIndex: 2 },
      ],
    },
  ];

  await Quiz.insertMany(CLASS_TWO_LESSONS);
  console.log("🔥 Class 2 lessons seeded successfully with text-only options!");
};

module.exports = seedClassTwoLessons;

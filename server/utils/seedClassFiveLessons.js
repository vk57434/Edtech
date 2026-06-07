const Quiz = require("../models/Quiz");

const seedClassFiveLessons = async () => {
  // Clear existing Class 5 quizzes
  await Quiz.deleteMany({ class: 5 });
  console.log("🧹 Cleared old Class 5 quizzes");

  const CLASS_FIVE_LESSONS = [
    {
      title: "Fractions Fundamentals",
      topic: "Fractions",
      class: 5,
      lessonTitle: "Understanding Fractions",
      lessonDescription: "Learn about fractions, numerators, denominators, and how to compare fractions.",
      videoUrl: "https://www.youtube.com/embed/DKanWcCq1B4",
      questions: [
        {
          text: "What does the numerator represent in a fraction?",
          options: [
            { text: "The total number of parts" },
            { text: "The number of parts we have" },
            { text: "The size of each part" },
            { text: "None of the above" },
          ],
          correctIndex: 1,
        },
        {
          text: "In the fraction 3/4, what is the denominator?",
          options: [
            { text: "3" },
            { text: "4" },
            { text: "7" },
            { text: "12" },
          ],
          correctIndex: 1,
        },
        {
          text: "Which fraction is larger: 1/2 or 1/4?",
          options: [
            { text: "1/2" },
            { text: "1/4" },
            { text: "They are equal" },
            { text: "Cannot be determined" },
          ],
          correctIndex: 0,
        },
        {
          text: "What is 1/2 + 1/2?",
          options: [
            { text: "1/4" },
            { text: "1/2" },
            { text: "1" },
            { text: "2/4" },
          ],
          correctIndex: 2,
        },
        {
          text: "If a pizza is cut into 8 slices and you eat 3, what fraction did you eat?",
          options: [
            { text: "3/8" },
            { text: "8/3" },
            { text: "5/8" },
            { text: "3/5" },
          ],
          correctIndex: 0,
        },
        {
          text: "Which fraction is equivalent to 1/2?",
          options: [
            { text: "2/3" },
            { text: "2/4" },
            { text: "3/4" },
            { text: "1/3" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is 1/3 + 1/3?",
          options: [
            { text: "2/3" },
            { text: "1/6" },
            { text: "2/6" },
            { text: "1/3" },
          ],
          correctIndex: 0,
        },
        {
          text: "What is 3/4 - 1/4?",
          options: [
            { text: "2/8" },
            { text: "2/4" },
            { text: "1/2" },
            { text: "4/4" },
          ],
          correctIndex: 1,
        },
        {
          text: "If you have 1/2 of a cake and your friend gives you 1/4 more, how much cake do you have?",
          options: [
            { text: "3/4" },
            { text: "2/4" },
            { text: "3/6" },
            { text: "1/6" },
          ],
          correctIndex: 0,
        },
        {
          text: "Which is the correct way to write 'three fifths'?",
          options: [
            { text: "5/3" },
            { text: "3/5" },
            { text: "3-5" },
            { text: "5.3" },
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      title: "Decimals and Place Values",
      topic: "Decimals",
      class: 5,
      lessonTitle: "Understanding Decimals",
      lessonDescription: "Learn about decimal places, reading decimals, and decimal operations.",
      videoUrl: "https://www.youtube.com/embed/DKanWcCq1B4",
      questions: [
        {
          text: "What is 0.5 as a fraction?",
          options: [
            { text: "1/10" },
            { text: "1/2" },
            { text: "5/10" },
            { text: "2/5" },
          ],
          correctIndex: 1,
        },
        {
          text: "In the number 3.45, what does the 4 represent?",
          options: [
            { text: "Tenths" },
            { text: "Hundredths" },
            { text: "Ones" },
            { text: "Tens" },
          ],
          correctIndex: 0,
        },
        {
          text: "What is 0.25 + 0.75?",
          options: [
            { text: "0.100" },
            { text: "1.00" },
            { text: "0.99" },
            { text: "10.0" },
          ],
          correctIndex: 1,
        },
        {
          text: "Which is larger: 0.7 or 0.70?",
          options: [
            { text: "0.7" },
            { text: "0.70" },
            { text: "They are equal" },
            { text: "Cannot be determined" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 1.5 - 0.5?",
          options: [
            { text: "1.0" },
            { text: "1.10" },
            { text: "0.10" },
            { text: "2.0" },
          ],
          correctIndex: 0,
        },
        {
          text: "In 5.68, the 8 is in which place?",
          options: [
            { text: "Tenths" },
            { text: "Hundredths" },
            { text: "Ones" },
            { text: "Tens" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is 2.3 + 1.7?",
          options: [
            { text: "3.10" },
            { text: "4.0" },
            { text: "3.0" },
            { text: "4.10" },
          ],
          correctIndex: 1,
        },
        {
          text: "How many hundredths are in 1?",
          options: [
            { text: "10" },
            { text: "100" },
            { text: "1" },
            { text: "1000" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is 0.1 × 5?",
          options: [
            { text: "0.5" },
            { text: "5" },
            { text: "50" },
            { text: "0.05" },
          ],
          correctIndex: 0,
        },
        {
          text: "What is 2.5 ÷ 5?",
          options: [
            { text: "0.5" },
            { text: "1.0" },
            { text: "0.2" },
            { text: "5.0" },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      title: "Multiplication Mastery",
      topic: "Multiplication",
      class: 5,
      lessonTitle: "Multi-Digit Multiplication",
      lessonDescription: "Learn strategies for multiplying larger numbers efficiently.",
      videoUrl: "https://www.youtube.com/embed/DKanWcCq1B4",
      questions: [
        {
          text: "What is 12 × 5?",
          options: [
            { text: "50" },
            { text: "55" },
            { text: "60" },
            { text: "70" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 15 × 4?",
          options: [
            { text: "50" },
            { text: "55" },
            { text: "60" },
            { text: "65" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 25 × 3?",
          options: [
            { text: "60" },
            { text: "70" },
            { text: "75" },
            { text: "80" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 11 × 11?",
          options: [
            { text: "111" },
            { text: "121" },
            { text: "112" },
            { text: "122" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is 20 × 6?",
          options: [
            { text: "100" },
            { text: "110" },
            { text: "120" },
            { text: "130" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 13 × 7?",
          options: [
            { text: "85" },
            { text: "91" },
            { text: "98" },
            { text: "105" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is 18 × 5?",
          options: [
            { text: "80" },
            { text: "85" },
            { text: "90" },
            { text: "95" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 22 × 4?",
          options: [
            { text: "84" },
            { text: "86" },
            { text: "88" },
            { text: "90" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 16 × 3?",
          options: [
            { text: "42" },
            { text: "45" },
            { text: "48" },
            { text: "50" },
          ],
          correctIndex: 2,
        },
        {
          text: "What is 14 × 6?",
          options: [
            { text: "78" },
            { text: "80" },
            { text: "82" },
            { text: "84" },
          ],
          correctIndex: 3,
        },
      ],
    },
    {
      title: "Divisibility Rules",
      topic: "Divisibility Rules",
      class: 5,
      lessonTitle: "Learn Divisibility Rules",
      lessonDescription: "Discover quick tricks for checking whether numbers are divisible by 2, 3, 5, 9, and 10.",
      videoUrl: "https://www.youtube.com/embed/0DMBjvUdtMo",
      questions: [
        {
          text: "Which rule tells you if a number is divisible by 2?",
          options: [
            { text: "The number ends in 0 or 5" },
            { text: "The sum of digits is divisible by 3" },
            { text: "The number is even" },
            { text: "The last digit is 9" },
          ],
          correctIndex: 2,
        },
        {
          text: "Is 45 divisible by 5?",
          options: [
            { text: "Yes, because it ends in 5" },
            { text: "No, because 4 + 5 = 9" },
            { text: "Yes, because it is even" },
            { text: "No, because it is odd" },
          ],
          correctIndex: 0,
        },
        {
          text: "Which divisibility rule is used for 9?",
          options: [
            { text: "Last digit is 0 or 5" },
            { text: "Last two digits divisible by 4" },
            { text: "Sum of digits divisible by 9" },
            { text: "Number is even" },
          ],
          correctIndex: 2,
        },
        {
          text: "Is 132 divisible by 3?",
          options: [
            { text: "Yes, because 1 + 3 + 2 = 6" },
            { text: "No, because it ends in 2" },
            { text: "Yes, because it is greater than 100" },
            { text: "No, because 132 is not odd" },
          ],
          correctIndex: 0,
        },
        {
          text: "A number is divisible by 10 if it ends in which digit?",
          options: [
            { text: "5" },
            { text: "0" },
            { text: "2" },
            { text: "9" },
          ],
          correctIndex: 1,
        },
        {
          text: "Is 84 divisible by 2 and 3?",
          options: [
            { text: "Yes, it is divisible by both" },
            { text: "No, it is divisible by 2 only" },
            { text: "No, it is divisible by 3 only" },
            { text: "No, it is divisible by neither" },
          ],
          correctIndex: 0,
        },
        {
          text: "Which number is divisible by 5?",
          options: [
            { text: "121" },
            { text: "220" },
            { text: "333" },
            { text: "448" },
          ],
          correctIndex: 1,
        },
        {
          text: "What is the divisibility rule for 3?",
          options: [
            { text: "The number ends with 3" },
            { text: "The digits add up to a multiple of 3" },
            { text: "The last digit is 0 or 5" },
            { text: "The number is odd" },
          ],
          correctIndex: 1,
        },
        {
          text: "Is 90 divisible by 9?",
          options: [
            { text: "Yes, because 9 + 0 = 9" },
            { text: "No, because it is even" },
            { text: "Yes, because it ends in 0" },
            { text: "No, because it ends in 5" },
          ],
          correctIndex: 0,
        },
        {
          text: "Which number is divisible by 10?",
          options: [
            { text: "37" },
            { text: "40" },
            { text: "53" },
            { text: "66" },
          ],
          correctIndex: 1,
        },
      ],
    },
  ];

  for (const lesson of CLASS_FIVE_LESSONS) {
    const quizData = new Quiz({
      title: lesson.title,
      topic: lesson.topic,
      class: lesson.class,
      lessonTitle: lesson.lessonTitle,
      lessonDescription: lesson.lessonDescription,
      videoUrl: lesson.videoUrl,
      questions: lesson.questions,
    });

    await quizData.save();
  }

  console.log("✅ Class 5 Math quizzes seeded successfully!");
};

module.exports = seedClassFiveLessons;

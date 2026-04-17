const Quiz = require("../models/Quiz");

const generateImage = (text) => {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${text} cute colorful cartoon icon for kids`
  )}`;
};

const CLASS_ONE_LESSONS = [
  {
    title: "Math Counting Fun",
    topic: "Math",
    class: 1,
    lessonTitle: "Count Numbers 1 to 10",
    lessonDescription: "Learn counting with apples, stars, and simple number games.",
    videoUrl: "https://www.youtube.com/embed/bGetqbqDVaA",
    questions: [
      {
        text: "How many apples are there in a group of 3 apples?",
        options: [
          { text: "2" },
          { text: "3" },
          { text: "5" },
          { text: "7" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which number comes after 4?",
        options: [
          { text: "3" },
          { text: "5" },
          { text: "6" },
          { text: "8" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which group has more objects?",
        options: [
          { text: "2 stars" },
          { text: "5 stars" },
          { text: "1 star" },
          { text: "3 stars" },
        ],
        correctIndex: 1,
      },
      {
        text: "What is 2 + 1?",
        options: [
          { text: "1" },
          { text: "2" },
          { text: "3" },
          { text: "4" },
        ],
        correctIndex: 2,
      },
      {
        text: "How many stars are there: ★ ★ ★ ★?",
        options: [
          { text: "3" },
          { text: "4" },
          { text: "5" },
          { text: "6" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which group shows 5 apples?",
        options: [
          { text: "🍎 🍎" },
          { text: "🍎 🍎 🍎" },
          { text: "🍎 🍎 🍎 🍎" },
          { text: "🍎 🍎 🍎 🍎 🍎" },
        ],
        correctIndex: 3,
      },
      {
        text: "What is 5 + 2?",
        options: [
          { text: "6" },
          { text: "7" },
          { text: "8" },
          { text: "9" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which number is the smallest?",
        options: [
          { text: "9" },
          { text: "6" },
          { text: "3" },
          { text: "1" },
        ],
        correctIndex: 3,
      },
      {
        text: "Count the ducks: 🦆 🦆 🦆. How many?",
        options: [
          { text: "2" },
          { text: "3" },
          { text: "4" },
          { text: "5" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which shows counting from 1 to 5 in order?",
        options: [
          { text: "1, 3, 2, 4, 5" },
          { text: "5, 4, 3, 2, 1" },
          { text: "1, 2, 3, 4, 5" },
          { text: "2, 1, 3, 5, 4" },
        ],
        correctIndex: 2,
      },
      {
        text: "What number comes before 8?",
        options: [
          { text: "6" },
          { text: "7" },
          { text: "9" },
          { text: "10" },
        ],
        correctIndex: 1,
      },
      {
        text: "How many fingers are on one hand?",
        options: [
          { text: "3" },
          { text: "4" },
          { text: "5" },
          { text: "6" },
        ],
        correctIndex: 2,
      },
      {
        text: "What is 4 + 4?",
        options: [
          { text: "6" },
          { text: "7" },
          { text: "8" },
          { text: "9" },
        ],
        correctIndex: 2,
      },
      {
        text: "Which number is greater than 6?",
        options: [
          { text: "2" },
          { text: "5" },
          { text: "7" },
          { text: "4" },
        ],
        correctIndex: 2,
      },
      {
        text: "Count the balls: ⚽ ⚽ ⚽ ⚽ ⚽ ⚽. How many?",
        options: [
          { text: "4" },
          { text: "5" },
          { text: "6" },
          { text: "7" },
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    title: "Science Plants Around Us",
    topic: "Science",
    class: 1,
    lessonTitle: "Parts of a Plant",
    lessonDescription: "See how roots, stem, leaves, and flowers help a plant grow.",
    videoUrl: "https://www.youtube.com/embed/p3St51F4kE8",
    questions: [
      {
        text: "Which part of the plant is green and makes food?",
        options: [
          { text: "Leaf" },
          { text: "Root" },
          { text: "Stone" },
          { text: "Cloud" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which part holds the plant in the soil?",
        options: [
          { text: "Flower" },
          { text: "Root" },
          { text: "Leaf" },
          { text: "Sun" },
        ],
        correctIndex: 1,
      },
      {
        text: "Plants need what to grow?",
        options: [
          { text: "Water" },
          { text: "Toys" },
          { text: "Shoes" },
          { text: "Pencils" },
        ],
        correctIndex: 0,
      },
      {
        text: "What part carries water up the plant?",
        options: [
          { text: "Stem" },
          { text: "Fruit" },
          { text: "Book" },
          { text: "Petal" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which of these is a living thing?",
        options: [
          { text: "Rock" },
          { text: "Table" },
          { text: "Tree" },
          { text: "Toy car" },
        ],
        correctIndex: 2,
      },
      {
        text: "Plants need sunlight to:",
        options: [
          { text: "Sleep" },
          { text: "Make food" },
          { text: "Play games" },
          { text: "Make noise" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which part of the plant grows into a new plant?",
        options: [
          { text: "Root" },
          { text: "Leaf" },
          { text: "Seed" },
          { text: "Stem" },
        ],
        correctIndex: 2,
      },
      {
        text: "Plants get water from the:",
        options: [
          { text: "Sky" },
          { text: "Soil" },
          { text: "Clouds" },
          { text: "Air" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which one is NOT a part of a plant?",
        options: [
          { text: "Flower" },
          { text: "Leaf" },
          { text: "Root" },
          { text: "Pillow" },
        ],
        correctIndex: 3,
      },
      {
        text: "Which plant part is usually colorful and attracts bees?",
        options: [
          { text: "Root" },
          { text: "Flower" },
          { text: "Stem" },
          { text: "Seed" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which part of the plant makes new fruits?",
        options: [
          { text: "Flower" },
          { text: "Root" },
          { text: "Stone" },
          { text: "Soil" },
        ],
        correctIndex: 0,
      },
      {
        text: "What do roots take in from the soil?",
        options: [
          { text: "Water" },
          { text: "Toys" },
          { text: "Paper" },
          { text: "Music" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which part helps the plant stand upright?",
        options: [
          { text: "Leaf" },
          { text: "Stem" },
          { text: "Seed" },
          { text: "Petal" },
        ],
        correctIndex: 1,
      },
      {
        text: "A sunflower is an example of a:",
        options: [
          { text: "Plant" },
          { text: "Chair" },
          { text: "Bird" },
          { text: "River" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which helps plants grow well?",
        options: [
          { text: "Sunlight and water" },
          { text: "Plastic and glue" },
          { text: "Shoes and socks" },
          { text: "Books and pens" },
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    title: "English Alphabet Adventure",
    topic: "English",
    class: 1,
    lessonTitle: "Alphabet and Simple Words",
    lessonDescription: "Practice letters, sounds, and easy words used every day.",
    videoUrl: "https://www.youtube.com/embed/75p-N9YKqNo",
    questions: [
      {
        text: "Which letter comes after A?",
        options: [
          { text: "B" },
          { text: "C" },
          { text: "D" },
          { text: "Z" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which word starts with C?",
        options: [
          { text: "Apple" },
          { text: "Ball" },
          { text: "Cat" },
          { text: "Egg" },
        ],
        correctIndex: 2,
      },
      {
        text: "Which is a vowel?",
        options: [
          { text: "B" },
          { text: "E" },
          { text: "T" },
          { text: "M" },
        ],
        correctIndex: 1,
      },
      {
        text: "Choose the correct word for a pet that says meow.",
        options: [
          { text: "Dog" },
          { text: "Cat" },
          { text: "Sun" },
          { text: "Pen" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which word begins with the letter B?",
        options: [
          { text: "Apple" },
          { text: "Ball" },
          { text: "Cat" },
          { text: "Egg" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which is a small letter?",
        options: [
          { text: "A" },
          { text: "B" },
          { text: "c" },
          { text: "D" },
        ],
        correctIndex: 2,
      },
      {
        text: "Which word rhymes with cat?",
        options: [
          { text: "Dog" },
          { text: "Rat" },
          { text: "Sun" },
          { text: "Pen" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which word is a name of an animal?",
        options: [
          { text: "Run" },
          { text: "Jump" },
          { text: "Lion" },
          { text: "Blue" },
        ],
        correctIndex: 2,
      },
      {
        text: "Which pair shows the same beginning sound?",
        options: [
          { text: "Ball – Cat" },
          { text: "Dog – Duck" },
          { text: "Sun – Pen" },
          { text: "Rat – Sun" },
        ],
        correctIndex: 1,
      },
      {
        text: "Which sentence is correct?",
        options: [
          { text: "the cat runs." },
          { text: "The cat runs" },
          { text: "the Cat Runs." },
          { text: "The cat runs." },
        ],
        correctIndex: 3,
      },
      {
        text: "Which letter comes before D?",
        options: [
          { text: "A" },
          { text: "B" },
          { text: "C" },
          { text: "E" },
        ],
        correctIndex: 2,
      },
      {
        text: "Which word starts with the letter S?",
        options: [
          { text: "Sun" },
          { text: "Ball" },
          { text: "Cat" },
          { text: "Fish" },
        ],
        correctIndex: 0,
      },
      {
        text: "Choose the word that names a thing you can read.",
        options: [
          { text: "Book" },
          { text: "Run" },
          { text: "Jump" },
          { text: "Sing" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which word begins with the same sound as bat?",
        options: [
          { text: "Ball" },
          { text: "Cat" },
          { text: "Dog" },
          { text: "Sun" },
        ],
        correctIndex: 0,
      },
      {
        text: "Which is an uppercase letter?",
        options: [
          { text: "m" },
          { text: "t" },
          { text: "P" },
          { text: "g" },
        ],
        correctIndex: 2,
      },
    ],
  },
];

const CLASS_LEVELS = [1, 2, 3, 4, 5];

const CLASS_TWO_MATH_QUESTIONS = [
  {
    text: "What is 12 ÷ 3?",
    options: [
      { text: "2" },
      { text: "3" },
      { text: "4" },
      { text: "6" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which number sentence is correct?",
    options: [
      { text: "8 ÷ 2 = 6" },
      { text: "10 ÷ 5 = 2" },
      { text: "9 ÷ 3 = 2" },
      { text: "6 ÷ 3 = 1" },
    ],
    correctIndex: 1,
  },
  {
    text: "If 15 sweets are shared equally among 3 kids, each kid gets:",
    options: [
      { text: "3" },
      { text: "4" },
      { text: "5" },
      { text: "6" },
    ],
    correctIndex: 2,
  },
  {
    text: "18 ÷ 2 equals:",
    options: [
      { text: "6" },
      { text: "8" },
      { text: "9" },
      { text: "10" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which shows 20 ÷ 5?",
    options: [
      { text: "5 + 5 + 5 + 5" },
      { text: "5 groups of 4" },
      { text: "4 groups of 5" },
      { text: "2 groups of 10" },
    ],
    correctIndex: 2,
  },
  {
    text: "There are 16 pencils shared equally among 4 friends. Each friend gets:",
    options: [
      { text: "2" },
      { text: "3" },
      { text: "4" },
      { text: "5" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which is the same as 9 ÷ 3?",
    options: [
      { text: "3 + 3 + 3" },
      { text: "2 + 2 + 2" },
      { text: "5 + 4" },
      { text: "6 + 3" },
    ],
    correctIndex: 0,
  },
  {
    text: "24 sweets shared among 4 children gives each child:",
    options: [
      { text: "4" },
      { text: "5" },
      { text: "6" },
      { text: "8" },
    ],
    correctIndex: 2,
  },
  {
    text: "20 ÷ 2 equals:",
    options: [
      { text: "5" },
      { text: "8" },
      { text: "10" },
      { text: "12" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which picture shows 3 equal groups?",
    options: [
      { text: "⚽⚽⚽⚽⚽" },
      { text: "⚽⚽ | ⚽⚽ | ⚽⚽" },
      { text: "⚽⚽⚽ | ⚽⚽" },
      { text: "⚽ | ⚽⚽ | ⚽⚽⚽" },
    ],
    correctIndex: 1,
  },
  {
    text: "21 ÷ 3 equals:",
    options: [
      { text: "5" },
      { text: "6" },
      { text: "7" },
      { text: "8" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which division fact is true?",
    options: [
      { text: "14 ÷ 2 = 5" },
      { text: "16 ÷ 4 = 4" },
      { text: "12 ÷ 3 = 5" },
      { text: "10 ÷ 2 = 6" },
    ],
    correctIndex: 1,
  },
  {
    text: "If 18 crayons are shared in 3 equal groups, each group has:",
    options: [
      { text: "4" },
      { text: "5" },
      { text: "6" },
      { text: "7" },
    ],
    correctIndex: 2,
  },
  {
    text: "Which is the answer to 27 ÷ 9?",
    options: [
      { text: "2" },
      { text: "3" },
      { text: "4" },
      { text: "5" },
    ],
    correctIndex: 1,
  },
  {
    text: "30 sweets shared equally among 5 children gives each child:",
    options: [
      { text: "5" },
      { text: "6" },
      { text: "7" },
      { text: "8" },
    ],
    correctIndex: 1,
  },
];

const CLASS_TWO_ENGLISH_QUESTIONS = [
  {
    text: "The cat is ___ the table.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "under" },
      { text: "behind" },
    ],
    correctIndex: 1,
  },
  {
    text: "The ball is ___ the box.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "over" },
      { text: "between" },
    ],
    correctIndex: 0,
  },
  {
    text: "Choose the correct sentence.",
    options: [
      { text: "The boy is under the chair on." },
      { text: "The boy is in the chair." },
      { text: "The boy is on the chair." },
      { text: "The boy the chair under is." },
    ],
    correctIndex: 2,
  },
  {
    text: "The school bus stops ___ the gate.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "at" },
      { text: "between" },
    ],
    correctIndex: 2,
  },
  {
    text: "The puppy is sitting ___ the box.",
    options: [
      { text: "between" },
      { text: "under" },
      { text: "at" },
      { text: "on" },
    ],
    correctIndex: 1,
  },
  {
    text: "The pictures are hanging ___ the wall.",
    options: [
      { text: "on" },
      { text: "in" },
      { text: "under" },
      { text: "between" },
    ],
    correctIndex: 0,
  },
  {
    text: "The bird is flying ___ the trees.",
    options: [
      { text: "under" },
      { text: "between" },
      { text: "over" },
      { text: "in" },
    ],
    correctIndex: 2,
  },
  {
    text: "The ball rolled ___ the table and stopped.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "under" },
      { text: "between" },
    ],
    correctIndex: 2,
  },
  {
    text: "My school is ___ my house and the park.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "behind" },
      { text: "between" },
    ],
    correctIndex: 3,
  },
  {
    text: "We are sitting ___ the classroom.",
    options: [
      { text: "at" },
      { text: "in" },
      { text: "on" },
      { text: "under" },
    ],
    correctIndex: 1,
  },
  {
    text: "The shoes are ___ the bed.",
    options: [
      { text: "under" },
      { text: "in" },
      { text: "over" },
      { text: "between" },
    ],
    correctIndex: 0,
  },
  {
    text: "The clock is ___ the wall.",
    options: [
      { text: "in" },
      { text: "on" },
      { text: "under" },
      { text: "between" },
    ],
    correctIndex: 1,
  },
  {
    text: "The rabbit is hiding ___ the bush.",
    options: [
      { text: "at" },
      { text: "under" },
      { text: "in" },
      { text: "between" },
    ],
    correctIndex: 2,
  },
  {
    text: "The bridge goes ___ the river.",
    options: [
      { text: "over" },
      { text: "under" },
      { text: "in" },
      { text: "between" },
    ],
    correctIndex: 0,
  },
  {
    text: "The teacher is standing ___ the door.",
    options: [
      { text: "at" },
      { text: "between" },
      { text: "under" },
      { text: "on" },
    ],
    correctIndex: 0,
  },
];

const CLASS_VIDEOS = {
  1: {
    Math: "https://www.youtube.com/embed/bGetqbqDVaA",
    Science: "https://www.youtube.com/embed/p3St51F4kE8",
    English: "https://www.youtube.com/embed/75p-N9YKqNo",
  },
  2: {
    Math: "https://www.youtube.com/embed/xJ5w5WQBhO0",
    Science: "https://www.youtube.com/embed/QmQvdUaH7hE",
    English: "https://www.youtube.com/embed/4DLxGFDwFAY",
  },
};

const seedClassOneLessons = async () => {
  for (const classLevel of CLASS_LEVELS) {
    for (const lesson of CLASS_ONE_LESSONS) {
      const videosForClass = CLASS_VIDEOS[classLevel] || CLASS_VIDEOS[1] || {};
      const topicVideo = videosForClass[lesson.topic] || lesson.videoUrl;

      let baseQuestions = lesson.questions;
      if (classLevel === 2 && lesson.topic === "Math") {
        baseQuestions = CLASS_TWO_MATH_QUESTIONS;
      } else if (classLevel === 2 && lesson.topic === "English") {
        baseQuestions = CLASS_TWO_ENGLISH_QUESTIONS;
      }

      const lessonWithImages = {
        ...lesson,
        class: classLevel,
        videoUrl: topicVideo,
        questions: baseQuestions.map((question) => ({
          ...question,
          options: question.options.map((option) => ({
            ...option,
            image: generateImage(option.text),
          })),
        })),
      };

      await Quiz.updateOne(
        {
          class: classLevel,
          topic: lesson.topic,
        },
        { $set: lessonWithImages },
        { upsert: true }
      );
    }
  }

  console.log("🎬 Lesson quizzes synced for classes 1–5");
};

module.exports = seedClassOneLessons;

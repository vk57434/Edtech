const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const OpenAI = require("openai");

// ✅ OpenRouter Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ✅ FREE IMAGE GENERATOR
const generateImage = (text) => {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    text + " disney pixar style cartoon for kids colorful 3d"
  )}`;
};

// ✅ Generate AI Quiz
router.post("/generate", async (req, res) => {
  try {
    const { topic, classLevel } = req.body;

    if (!topic || !classLevel) {
      return res.status(400).json({
        message: "Topic and class are required",
      });
    }

    //------------------------------------------------
    // ⭐ CALL AI (STABLE MODEL)
    //------------------------------------------------

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // ⭐ VERY IMPORTANT (Change model)

      // ⭐ FORCE JSON OUTPUT
      response_format: { type: "json_object" },

      messages: [
        {
          role: "user",
          content: `
Create 5 VERY EASY MCQ quiz questions for Class ${classLevel} kids about "${topic}".

RULES:
- Return ONLY valid JSON
- No explanation
- No extra text
- Questions must be simple and visual for kids

FORMAT:

{
 "questions":[
  {
   "text":"Question here",
   "options":["Cat","Dog","Lion","Tiger"],
   "correctIndex":0
  }
 ]
}
`,
        },
      ],
    });

    //------------------------------------------------
    // CLEAN + SAFE JSON PARSE
    //------------------------------------------------

    let aiText = completion.choices[0].message.content.trim();

    let quizData;

    try {
      // Extract JSON safely
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      quizData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ JSON PARSE FAILED:");
      console.log(aiText);

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    //------------------------------------------------
    // ADD IMAGES TO OPTIONS
    //------------------------------------------------

    const questionsWithImages = quizData.questions.map((q) => ({
      text: q.text,
      correctIndex: q.correctIndex,

      options: q.options.map((opt) => ({
        text: opt,
        image: generateImage(opt),
      })),
    }));

    //------------------------------------------------
    // SAVE TO DB
    //------------------------------------------------

    const quiz = await Quiz.create({
      class: classLevel,
      topic,
      questions: questionsWithImages,
    });

    res.json({
      message: "✅ AI Quiz generated successfully!",
      quiz,
    });

  } catch (err) {
    console.error("🔥 FULL AI ERROR:");
    console.error(err.response?.data || err.message || err);

    res.status(500).json({
      message: "Error generating quiz",
    });
  }
});

module.exports = router;

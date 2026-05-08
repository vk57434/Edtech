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
const generateImage = (keyword, topic) => {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    keyword + " for kids " + topic + " educational 3d cartoon style high quality"
  )}?width=400&height=400&nologo=true`;
};

// ✅ Generate AI Quiz
router.post("/generate", async (req, res) => {
  try {
    const { topic, classLevel, videoUrl, lessonTitle, lessonDescription } = req.body;

    console.log(`🤖 AI Generation started for: ${topic} (Class ${classLevel})`);

    if (!topic || !classLevel) {
      return res.status(400).json({
        message: "Topic and class are required",
      });
    }

    //------------------------------------------------
    // ⭐ CALL AI (STABLE MODEL)
    //------------------------------------------------

    const prompt = `
Create 10 MCQ quiz questions for Class ${classLevel} kids about "${topic}".
${lessonTitle ? `The lesson is titled "${lessonTitle}".` : ""}
${lessonDescription ? `Description: "${lessonDescription}".` : ""}
${videoUrl ? `The quiz is based on this educational video: ${videoUrl}` : ""}

RULES:
- Return ONLY valid JSON
- No explanation
- No extra text
- For each option, provide a short 'visualKeyword' (1-2 words) that describes it for an image generator.

FORMAT:

{
 "questions":[
  {
   "text":"Question here",
   "options":[
     {"text": "Option 1", "visualKeyword": "keyword1"},
     {"text": "Option 2", "visualKeyword": "keyword2"},
     {"text": "Option 3", "visualKeyword": "keyword3"},
     {"text": "Option 4", "visualKeyword": "keyword4"}
   ],
   "correctIndex":0
  }
 ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // ⭐ VERY IMPORTANT (Change model)

      // ⭐ FORCE JSON OUTPUT
      response_format: { type: "json_object" },

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    //------------------------------------------------
    // CLEAN + SAFE JSON PARSE
    //------------------------------------------------

    let aiText = completion.choices[0].message.content.trim();
    console.log("📥 AI Response received");

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
        text: opt.text,
        image: generateImage(opt.visualKeyword || opt.text, topic),
      })),
    }));

    //------------------------------------------------
    // SAVE TO DB
    //------------------------------------------------

    const quiz = await Quiz.create({
      class: classLevel,
      topic,
      lessonTitle,
      lessonDescription,
      videoUrl,
      questions: questionsWithImages,
    });

    console.log(`✅ AI Quiz saved successfully: ${quiz._id}`);

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

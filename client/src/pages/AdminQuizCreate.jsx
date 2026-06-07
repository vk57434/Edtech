import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminQuizCreate() {
  const [quiz, setQuiz] = useState({
    title: "",
    topic: "",
    subject: "Math",
    class: "",
    lessonTitle: "",
    lessonDescription: "",
    videoUrl: "",
    questions: [],
  });
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctIndex: 0,
        },
      ],
    });
  };

  const updateQuestion = (index, field, value) => {
    const nextQuestions = [...quiz.questions];
    nextQuestions[index] = {
      ...nextQuestions[index],
      [field]: value,
    };
    setQuiz({ ...quiz, questions: nextQuestions });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const nextQuestions = [...quiz.questions];
    nextQuestions[qIndex].options[optIndex] = value;
    setQuiz({ ...quiz, questions: nextQuestions });
  };

  const saveQuiz = async () => {
    if (!quiz.topic || !quiz.class || !quiz.questions.length) {
      alert("Please add topic, class, and at least one question.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/quiz`, quiz);
      alert("Quiz Created ✅");
      setQuiz({
        title: "",
        topic: "",
        subject: "Math",
        class: "",
        lessonTitle: "",
        lessonDescription: "",
        videoUrl: "",
        questions: [],
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold mb-4">🧠 Create Admin Quiz</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={quiz.topic}
            placeholder="Topic (e.g. Fractions)"
            onChange={(e) => setQuiz({ ...quiz, topic: e.target.value })}
            className="border p-3 rounded-lg"
          />
          <select
            value={quiz.subject}
            onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
            className="border p-3 rounded-lg"
          >
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="General Knowledge">General Knowledge</option>
            <option value="History">History</option>
          </select>
          <input
            value={quiz.class}
            type="number"
            min="1"
            max="10"
            placeholder="Class (1–10)"
            onChange={(e) => setQuiz({ ...quiz, class: e.target.value })}
            className="border p-3 rounded-lg"
          />
          <input
            value={quiz.videoUrl}
            placeholder="Video URL"
            onChange={(e) => setQuiz({ ...quiz, videoUrl: e.target.value })}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-4 grid gap-4">
          <input
            value={quiz.lessonTitle}
            placeholder="Lesson Title"
            onChange={(e) => setQuiz({ ...quiz, lessonTitle: e.target.value })}
            className="border p-3 rounded-lg"
          />
          <textarea
            value={quiz.lessonDescription}
            placeholder="Lesson Description"
            onChange={(e) => setQuiz({ ...quiz, lessonDescription: e.target.value })}
            rows="3"
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Add Question
            </button>
          </div>

          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <input
                value={question.text}
                placeholder={`Question ${qIndex + 1}`}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                className="border p-3 rounded-lg w-full mb-3"
              />

              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    value={option}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="border p-3 rounded-lg"
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3 text-sm">
                <label className="font-semibold">Correct option:</label>
                <select
                  value={question.correctIndex}
                  onChange={(e) => updateQuestion(qIndex, "correctIndex", Number(e.target.value))}
                  className="border p-2 rounded-lg"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <option key={index} value={index}>
                      Option {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveQuiz}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "Saving quiz..." : "Save Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

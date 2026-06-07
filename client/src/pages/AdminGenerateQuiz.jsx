import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AdminGenerateQuiz() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Math");
  const [classLevel, setClassLevel] = useState(1);
  const [videoUrl, setVideoUrl] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateQuiz = async () => {
    if (!topic || !classLevel) {
      alert("Please provide at least a topic and class level.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/ai/generate`, {
        topic,
        subject,
        classLevel: Number(classLevel),
        videoUrl,
        lessonTitle,
        lessonDescription,
      });

      alert("🔥 AI Quiz Generated Successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      alert("Error generating quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Quiz Generator</h1>
          <p className="mt-2 text-slate-600 text-sm">
            Generate educational quizzes automatically using AI based on topics or videos.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject (Required)</label>
            <select
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-300 transition"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="History">History</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Topic (Required)</label>
            <input
              placeholder="e.g. Parts of a Plant"
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300 transition"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Class (Required)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setClassLevel(num)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all ${
                    classLevel === num
                      ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ensure this matches the student's grade</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Video & Lesson Details (Optional)</h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight mb-4">✨ AI will automatically suggest a video if left blank</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Video URL</label>
                <input
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300 transition"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Title</label>
                <input
                  placeholder="e.g. Introduction to Botany"
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300 transition"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Description</label>
                <textarea
                  placeholder="What is this lesson about?"
                  rows="3"
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300 transition resize-none"
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading}
            className={`w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all ${
              loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Quiz...
              </span>
            ) : "Generate AI Quiz"}
          </button>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full rounded-2xl py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
}

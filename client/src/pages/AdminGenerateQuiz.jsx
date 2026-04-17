import { useState } from "react";
import axios from "axios";

export default function AdminGenerateQuiz() {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/ai/generate", {
        topic,
        classLevel: Number(classLevel),
      });

      alert("🔥 AI Quiz Generated!");
    } catch {
      alert("Error generating quiz");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 AI Quiz Generator</h1>

      <input
        placeholder="Enter Topic (e.g. Solar System)"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTopic(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setClassLevel(e.target.value)}
      >
        <option value="1">Class 1</option>
        <option value="2">Class 2</option>
        <option value="3">Class 3</option>
        <option value="4">Class 4</option>
        <option value="5">Class 5</option>
      </select>

      <button
        onClick={generateQuiz}
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Generating..." : "Generate AI Quiz"}
      </button>
    </div>
  );
}

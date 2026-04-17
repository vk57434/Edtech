import { useState } from "react";
import axios from "axios";

export default function AdminQuizCreate() {
  const [quiz, setQuiz] = useState({
    title: "",
    class: "",
    questions: [],
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { text: "", options: ["", "", "", ""], correctIndex: 0 }
      ],
    });
  };

  const saveQuiz = async () => {
    await axios.post("http://localhost:5000/api/quiz", quiz);
    alert("Quiz Created ✅");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🧠 Create Quiz</h1>

      <input
        placeholder="Quiz Title"
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        className="border p-2 w-full my-2"
      />

      <input
        type="number"
        placeholder="Class (1–5)"
        onChange={(e) => setQuiz({ ...quiz, class: e.target.value })}
        className="border p-2 w-full my-2"
      />

      <button onClick={addQuestion} className="bg-blue-600 text-white px-4 py-2">
        + Add Question
      </button>

      <button onClick={saveQuiz} className="bg-green-600 text-white px-4 py-2 ml-3">
        Save Quiz
      </button>
    </div>
  );
}

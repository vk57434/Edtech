import Confetti from "react-confetti";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect } from "react";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, student, returnTo } = location.state || {};
  const backPath = returnTo || "/parent-dashboard";

  //------------------------------------------------
  // ✅ Protect Route (DO NOT navigate inside render)
  //------------------------------------------------
  useEffect(() => {
    if (score === undefined || total === undefined) {
      navigate("/");
    }
  }, [score, total, navigate]);

  if (score === undefined || total === undefined) {
    return null;
  }

  //------------------------------------------------

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 40;

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      {/* 🎉 CONFETTI */}
      {passed && <Confetti numberOfPieces={400} recycle={false} />}

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-96">

        <h1 className="text-3xl font-bold mb-4">
          🎓 Quiz Result
        </h1>

        <p className="mb-2 text-gray-600">
          Student: <b>{student?.name}</b>
        </p>

        {/* 🏆 SCORE CIRCLE */}
        <div className="w-40 h-40 mx-auto my-6">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
          />
        </div>

        {/* ⭐ PASS / FAIL */}
        <h2
          className={`text-2xl font-bold mb-4 ${
            passed ? "text-green-600" : "text-red-500"
          }`}
        >
          {passed ? "🎉 Passed!" : "📚 Try Again!"}
        </h2>

        <p className="mb-6">
          Score: <b>{score}</b> / {total}
        </p>

        <button
          onClick={() => navigate(backPath)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

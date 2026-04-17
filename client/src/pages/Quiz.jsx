import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const MOTION_USED = motion;

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const selectedTopic = location.state?.topic;
  const returnTo = location.state?.returnTo || "/parent-dashboard";

  const [quiz, setQuiz] = useState(null);
  const [videoDone, setVideoDone] = useState(false);
  const [canStartQuiz, setCanStartQuiz] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  //------------------------------------------------
  // Protect Route + Fetch Quiz
  //------------------------------------------------
  useEffect(() => {
    if (!student) {
      navigate(returnTo);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const query = selectedTopic
          ? `?topic=${encodeURIComponent(selectedTopic)}`
          : "";
        const res = await axios.get(
          `http://localhost:5000/api/quiz/random/${student.class}${query}`,
        );

        if (!res.data?.questions?.length) {
          alert("No quiz available");
          navigate(returnTo);
          return;
        }

        setQuiz(res.data);
      } catch {
        alert("Quiz not found");
        navigate(returnTo);
      }
    };

    fetchQuiz();
  }, [student, navigate, selectedTopic, returnTo]);

  useEffect(() => {
    if (!quiz?.videoUrl) return;

    let player;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      player = new window.YT.Player("quiz-player", {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setCanStartQuiz(true);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === "function") previous();
        createPlayer();
      };

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [quiz]);

  //------------------------------------------------
  // Finish Quiz
  //------------------------------------------------
  const finishQuiz = useCallback(
    async (finalScoreOverride) => {
      const finalScore =
        typeof finalScoreOverride === "number" ? finalScoreOverride : score;

      try {
        await axios.post("http://localhost:5000/api/quiz/submit", {
          studentId: student._id,
          quizId: quiz._id,
          class: student.class,
          score: finalScore,
          total: quiz.questions.length,
        });

        navigate("/result", {
          state: {
            score: finalScore,
            total: quiz.questions.length,
            student,
            returnTo,
          },
        });
      } catch (err) {
        console.error(err);

        alert("Result save failed — but quiz completed!");

        navigate("/result", {
          state: {
            score: finalScore,
            total: quiz.questions.length,
            student,
            returnTo,
          },
        });
      }
    },
    [navigate, quiz, returnTo, score, student],
  );

  //------------------------------------------------
  // Next Question
  //------------------------------------------------
  const nextQuestion = useCallback(() => {
    setAnswered(false);
    setSelected(null);
    setTimeLeft(20);

    setIndex((prev) => {
      if (prev + 1 < quiz.questions.length) return prev + 1;
      finishQuiz();
      return prev;
    });
  }, [finishQuiz, quiz]);

  //------------------------------------------------
  // Quiz Timer
  //------------------------------------------------
  useEffect(() => {
    if (!quiz || !videoDone) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          nextQuestion();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, nextQuestion, quiz, videoDone]);

  //------------------------------------------------
  // Select Option
  //------------------------------------------------
  const selectOption = (i) => {
    if (answered) return;

    setAnswered(true);
    setSelected(i);

    const question = quiz.questions[index];
    const isCorrect = i === question.correctIndex;
    const isLastQuestion = index === quiz.questions.length - 1;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (isLastQuestion) {
      const finalScore = score + (isCorrect ? 1 : 0);
      setTimeout(() => {
        finishQuiz(finalScore);
      }, 900);
    } else {
      setTimeout(nextQuestion, 900);
    }
  };

  //------------------------------------------------

  if (!quiz) {
    return <div className="p-6 text-lg font-semibold">Loading quiz...</div>;
  }

  //------------------------------------------------
  // ⭐ VIDEO SCREEN FIRST
  //------------------------------------------------

  if (!videoDone && quiz.videoUrl) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100 px-4">
        <motion.div
          className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-purple-300 opacity-40 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-20 bottom-[-5rem] h-72 w-72 rounded-full bg-pink-300 opacity-40 blur-3xl"
          animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-3xl bg-yellow-300/70"
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "loop" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-semibold text-indigo-700 shadow-sm"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>✨ Learning Mission</span>
            <span className="text-xs text-indigo-500">
              Class {student?.class} • {quiz.topic}
            </span>
          </motion.div>

          <motion.h1
            className="text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          >
            🎬 Watch & Learn!
          </motion.h1>

          <motion.p
            className="mb-2 text-center text-sm text-slate-600 md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Enjoy the animated video first, then your quiz will appear with fun picture questions.
          </motion.p>

          <motion.div
            className="relative mt-2 rounded-3xl border-4 border-white/70 bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.55)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-200/15 via-transparent to-sky-300/20" />
            <motion.iframe
              id="quiz-player"
              src={
                quiz.videoUrl.includes("enablejsapi=1")
                  ? quiz.videoUrl
                  : `${quiz.videoUrl}${
                      quiz.videoUrl.includes("?") ? "&" : "?"
                    }enablejsapi=1`
              }
              title="Learning Video"
              allowFullScreen
              className="relative z-10 h-[min(480px,56.25vw)] w-[min(900px,100vw-3rem)] rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          <motion.button
            type="button"
            disabled={!canStartQuiz}
            onClick={() => setVideoDone(true)}
            className={`mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition ${
              !canStartQuiz
                ? "cursor-not-allowed bg-slate-400"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
            whileHover={canStartQuiz ? { scale: 1.05 } : {}}
            whileTap={canStartQuiz ? { scale: 0.96 } : {}}
          >
            {canStartQuiz ? "Start Quiz 🚀" : "Watch full video to start quiz"}
          </motion.button>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>🌟 Tip:</span>
            <span>Watching carefully will help you crack all the questions.</span>
          </div>
        </div>
      </div>
    );
  }

  //------------------------------------------------
  // QUIZ UI
  //------------------------------------------------

  const question = quiz.questions[index];

  return (
    <motion.div
      className="p-6 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-2">🧠 Fun Quiz</h1>

      <p className="mb-4">
        Student: <strong>{student.name}</strong>
      </p>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded h-3 mb-4">
        <motion.div
          className="bg-blue-600 h-3 rounded"
          animate={{
            width: `${((index + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Timer */}
      <motion.p
        className="text-red-600 font-bold mb-3"
        animate={{ scale: timeLeft <= 3 ? 1.3 : 1 }}
        transition={{ repeat: Infinity, duration: 0.4 }}
      >
        ⏱ {timeLeft}s
      </motion.p>

      {/* Question Animation */}
      <AnimatePresence mode="wait">
        <motion.div
        
          key={index}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3">
            Q{index + 1}. {question.text}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {question.options?.map((opt, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = selected === i;

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: answered ? 1 : 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectOption(i)}
                  className={
                    [
                      "group cursor-pointer rounded-2xl overflow-hidden border-4 bg-white/90 shadow-lg transition-all duration-300",
                      !answered && "hover:shadow-2xl hover:-translate-y-1",
                      answered && isCorrect &&
                        "border-green-500 ring-4 ring-green-200 shadow-[0_0_30px_rgba(34,197,94,0.7)]",
                      answered && isSelected && !isCorrect &&
                        "border-red-500 ring-4 ring-red-200 shadow-[0_0_26px_rgba(248,113,113,0.7)]",
                      !answered && "border-transparent",
                      answered && !isSelected && !isCorrect && "border-transparent",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                >
                  {opt.image && (
                    <img
                      src={opt.image}
                      alt={opt.text}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300?text=Image";
                      }}
                      className="h-40 w-full object-cover transition-transform duration-300 sm:h-44 md:h-48 group-hover:scale-105"
                    />
                  )}

                  <div className="bg-white p-3 text-center text-base font-bold sm:text-lg">
                    {opt.text}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-sm text-gray-600">Score: {score}</p>
    </motion.div>
  );
}

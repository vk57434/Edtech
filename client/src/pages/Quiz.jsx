import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
// import QuizCard from "../components/QuizCard";

const MOTION_USED = motion;

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const selectedTopic = location.state?.topic;
  const returnTo = location.state?.returnTo || "/parent-dashboard";

  const [quiz, setQuiz] = useState(null);
  const [canStartQuiz, setCanStartQuiz] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoState, setVideoState] = useState("idle");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const toYouTubeWatchUrl = useCallback((rawUrl) => {
    if (!rawUrl) return "";
    try {
      const url = new URL(rawUrl);
      if (url.hostname.includes("youtu.be")) {
        const id = url.pathname.replace("/", "").trim();
        return id ? `https://www.youtube.com/watch?v=${id}` : rawUrl;
      }
      if (url.hostname.includes("youtube.com")) {
        const parts = url.pathname.split("/").filter(Boolean);
        const embedIndex = parts.indexOf("embed");
        if (embedIndex >= 0 && parts[embedIndex + 1]) {
          return `https://www.youtube.com/watch?v=${parts[embedIndex + 1]}`;
        }
        if (url.searchParams.get("v")) {
          return `https://www.youtube.com/watch?v=${url.searchParams.get("v")}`;
        }
      }
      return rawUrl;
    } catch {
      return rawUrl;
    }
  }, []);

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
        const url = `http://localhost:5000/api/quiz/random/${student.class}${query}`;
        console.log(`📡 Fetching quiz from: ${url}`);

        const res = await axios.get(url);

        if (!res.data?.questions?.length) {
          console.warn("⚠️ Received quiz with no questions:", res.data);
          alert("No quiz available");
          navigate(returnTo);
          return;
        }

        console.log("✅ Quiz loaded:", res.data.topic);
        setVideoDone(false);
        setCanStartQuiz(false);
        setVideoError(null);
        setVideoState(res.data?.videoUrl ? "loading" : "idle");
        setQuiz(res.data);
      } catch (err) {
        console.error("❌ Quiz fetch failed:", err.response?.data || err.message);
        alert("Quiz not found");
        navigate(returnTo);
      }
    };

    fetchQuiz();
  }, [student, navigate, selectedTopic, returnTo]);

  useEffect(() => {
    if (!quiz?.videoUrl) return;

    let player;
    let cancelled = false;
    const loadTimeout = setTimeout(() => {
      if (cancelled) return;
      setVideoState("error");
      setVideoError("timeout");
      setCanStartQuiz(true);
    }, 4000);

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !player && quiz.videoUrl) {
        console.log("🎬 Initializing YouTube Player...");

        // Extract videoId and start time
        let videoId = "";
        let listId = "";
        let start = 0;
        try {
          const url = new URL(quiz.videoUrl);
          if (quiz.videoUrl.includes("youtu.be/")) {
            videoId = url.pathname.substring(1);
          } else if (quiz.videoUrl.includes("embed/")) {
            const parts = url.pathname.split("/embed/")[1].split("?");
            if (parts[0] !== "videoseries") {
              videoId = parts[0];
            }
          } else {
            videoId = url.searchParams.get("v");
          }

          listId = url.searchParams.get("list");
          start = parseInt(url.searchParams.get("start") || url.searchParams.get("t") || "0");
        } catch (e) {
          console.error("Error parsing video URL:", e);
        }

        const playerVars = {
          autoplay: 1,
          controls: 1,
          rel: 0,
          showinfo: 0,
          ecver: 2,
          enablejsapi: 1,
          start: start,
          origin: window.location.origin
        };

        if (listId) {
          playerVars.listType = 'playlist';
          playerVars.list = listId;
        }

        player = new window.YT.Player("quiz-player", {
          videoId: videoId || undefined,
          playerVars: playerVars,
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                console.log("▶️ Video Playing - Quiz Unlocked early");
                setCanStartQuiz(true);
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                console.log("✅ Video Ended - Quiz Unlocked");
                setCanStartQuiz(true);
              }
            },
            onReady: () => {
              console.log("📺 YouTube Player Ready");
              clearTimeout(loadTimeout);
              if (!cancelled) setVideoState("ready");
            },
            onError: (err) => {
              console.error("❌ YouTube Player Error:", err);
              clearTimeout(loadTimeout);
              if (cancelled) return;
              setVideoState("error");
              setVideoError("Could not load video player");
              setCanStartQuiz(true); // Allow quiz anyway on error
            }
          },
        });
      }
    };

    if (!window.YT) {
      console.log("🌐 Loading YouTube IFrame API...");
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      cancelled = true;
      clearTimeout(loadTimeout);
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
            className="relative mt-2 w-full max-w-4xl overflow-hidden rounded-3xl border-4 border-white/70 bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.55)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-200/15 via-transparent to-sky-300/20" />
            <div className="relative z-10 w-full" style={{ aspectRatio: "16 / 9" }}>
              <div id="quiz-player" className="h-full w-full" />
            </div>
          </motion.div>

          {videoState === "loading" ? (
            <div className="mt-2 text-center text-xs font-semibold text-slate-500">
              Loading video...
            </div>
          ) : null}

          {videoState === "error" ? (
            <div className="mt-2 text-center text-xs font-semibold text-amber-700">
              Video couldn&apos;t load{videoError ? ` (code: ${videoError})` : ""}.{" "}
              <a
                href={toYouTubeWatchUrl(quiz.videoUrl)}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-700 underline underline-offset-2"
              >
                Open on YouTube
              </a>
            </div>
          ) : null}

          <motion.button
            type="button"
            disabled={!canStartQuiz}
            onClick={() => setVideoDone(true)}
            className={`mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition ${!canStartQuiz
              ? "cursor-not-allowed bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            whileHover={canStartQuiz ? { scale: 1.05 } : {}}
            whileTap={canStartQuiz ? { scale: 0.96 } : {}}
          >
            {canStartQuiz ? "🚀 Start Quiz Now!" : "📺 Watch Lesson to Unlock Quiz"}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Do you want to skip the lesson and start the quiz?")) {
                setVideoDone(true);
              }
            }}
            className="text-sm font-semibold text-slate-500 underline underline-offset-4 transition hover:text-slate-700 mt-2"
          >
            I've already watched this, skip to quiz
          </button>

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-indigo-50 py-12 px-4">
      {/* Background Decorations */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <header className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-100">
              🧠
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Fun Quiz Adventure
              </h1>
              <p className="text-sm font-semibold text-indigo-600">
                Playing as {student?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white px-5 py-2 shadow-sm ring-1 ring-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Score
              </span>
              <p className="text-xl font-black text-indigo-600">
                {score} <span className="text-sm text-slate-400">pts</span>
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Exit quiz? Your progress won't be saved.")) {
                  navigate(returnTo);
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-500 hover:ring-rose-200"
            >
              ✕
            </button>
          </div>
        </header>

        <main className="rounded-[2.5rem] bg-white/60 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm ring-1 ring-white/80 sm:p-10">
          <div className="w-full">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded h-3 mb-6 overflow-hidden shadow-inner">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded"
                initial={{ width: 0 }}
                animate={{
                  width: `${((index + 1) / quiz.questions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Timer Display */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold text-slate-500">
                Question {index + 1} of {quiz.questions.length}
              </span>
              <motion.div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold shadow-sm ${timeLeft <= 5 ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"
                  }`}
                animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
              >
                <span>⏱</span>
                <span>{timeLeft}s</span>
              </motion.div>
            </div>

            {/* Question with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-8 leading-tight">
                  {quiz.questions[index].text}
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                  {quiz.questions[index].options?.map((opt, i) => {
                    const isCorrect = i === quiz.questions[index].correctIndex;
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
                        <div className="bg-white p-6 text-center text-lg font-bold sm:text-xl">
                          {opt.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          Edtech for Kids • Interactive Learning
        </footer>
      </motion.div>
    </div>
  );
}


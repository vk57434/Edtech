import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ParentDashboardPage from "./pages/ParentDashboard.jsx";
import AdminDashboardPage from "./pages/AdminDashboard.jsx";
import AdminGenerateQuizPage from "./pages/AdminGenerateQuiz.jsx";
import QuizPage from "./pages/Quiz.jsx";
import ResultPage from "./pages/Result.jsx";
import "./App.css";

const API_URL = "http://localhost:5000/api";
const SESSION_KEY = "edtech-for-kids-session";

const learners = [
  {
    id: "explorer",
    name: "Tiny Explorer",
    age: "Ages 5-7",
    emoji: "🚀",
    description: "Story-based lessons, phonics fun, and counting games.",
  },
  {
    id: "inventor",
    name: "Junior Inventor",
    age: "Ages 8-10",
    emoji: "🛠️",
    description: "Hands-on science, logic puzzles, and speaking practice.",
  },
  {
    id: "champion",
    name: "Future Champion",
    age: "Ages 11-13",
    emoji: "🏆",
    description: "Smart revision paths, quick tests, and confidence coaching.",
  },
];

const subjects = [
  {
    id: "math",
    icon: "➕",
    name: "Math Galaxy",
    theme: "purple",
    headline: "Count, compare, and crack fun missions.",
    progress: 74,
    duration: "15 min",
    concept: "Fractions with pizza slices",
    story:
      "Captain Comet needs help sharing 8 pizza slices equally with the crew.",
    skills: ["Fractions", "Patterns", "Mental math"],
    challenge: "Build one whole pizza using 1/2 + 1/4 + 1/4.",
  },
  {
    id: "science",
    icon: "🔬",
    name: "Science Safari",
    theme: "teal",
    headline: "Observe, test, and discover how the world works.",
    progress: 61,
    duration: "18 min",
    concept: "How plants drink water",
    story:
      "Mimi the monkey wants to know how a white flower changes color in colored water.",
    skills: ["Plants", "Experiments", "Nature facts"],
    challenge: "Predict what happens if the stem is split into two colors.",
  },
  {
    id: "english",
    icon: "📚",
    name: "English Castle",
    theme: "orange",
    headline: "Read, speak, and write with brave word heroes.",
    progress: 82,
    duration: "12 min",
    concept: "Adjectives that paint pictures",
    story:
      "Princess Penny wants to turn plain sentences into bright story lines.",
    skills: ["Vocabulary", "Reading", "Speaking"],
    challenge: 'Upgrade "The dog ran" with two describing words.',
  },
];

const missions = [
  {
    title: "Warm-up video",
    detail: "2-minute animated concept story",
    reward: "20 stars",
  },
  {
    title: "Guided practice",
    detail: "Tap, drag, and answer while hints appear",
    reward: "35 stars",
  },
  {
    title: "Challenge round",
    detail: "Beat the timer and unlock a shiny badge",
    reward: "50 stars",
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "Which fraction is equal to one whole pizza?",
    options: ["1/2 + 1/2", "1/4 + 1/4", "1/2 + 1/4"],
    answer: "1/2 + 1/2",
  },
  {
    id: 2,
    question: "Plants need which part to take in sunlight?",
    options: ["Roots", "Leaves", "Soil"],
    answer: "Leaves",
  },
  {
    id: 3,
    question: 'Which word is an adjective in "The fluffy cat slept"?',
    options: ["slept", "cat", "fluffy"],
    answer: "fluffy",
  },
];

const parentHighlights = [
  { label: "Weekly streak", value: "6 days" },
  { label: "Concept mastery", value: "79%" },
  { label: "Confidence level", value: "High" },
  { label: "Screen time", value: "42 min/day" },
];

function readSession() {
  try {
    const savedSession = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (savedSession) {
      return savedSession;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    if (!savedUser) {
      return null;
    }

    if (savedUser.role === "parent") {
      return {
        ...savedUser,
        students: savedStudents || savedUser.students || [],
      };
    }

    return savedUser;
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("students");
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem("user", JSON.stringify(session));

  if (session.role === "parent") {
    localStorage.setItem("students", JSON.stringify(session.students || []));
  } else {
    localStorage.removeItem("students");
  }
}

function sanitizeStudent(student) {
  if (!student) {
    return student;
  }

  const { studentPin: _STUDENT_PIN, password: _PASSWORD, ...safeStudent } = student;
  return safeStudent;
}

function App() {
  return (
    <Router>
      <AppFrame />
    </Router>
  );
}

function AppFrame() {
  const [session, setSession] = useState(readSession);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleLogout = () => {
    setSession(null);
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Navbar session={session} pathname={location.pathname} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage session={session} />} />
        <Route path="/register" element={<ParentRegisterPage />} />
        <Route path="/login" element={<Navigate to="/parent-login" replace />} />
        <Route
          path="/parent-login"
          element={<ParentLoginPage onLoginSuccess={setSession} />}
        />
        <Route
          path="/kid-login"
          element={<KidLoginPage onLoginSuccess={setSession} />}
        />
        <Route
          path="/admin-login"
          element={<AdminLoginPage onLoginSuccess={setSession} />}
        />
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute session={session} allowedRoles={["parent"]}>
              <ParentDashboard session={session} onSessionUpdate={setSession} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kid-dashboard"
          element={
            <ProtectedRoute session={session} allowedRoles={["student"]}>
              <KidDashboard session={session} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute session={session} allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-ai"
          element={
            <ProtectedRoute session={session} allowedRoles={["admin"]}>
              <AdminGenerateQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute session={session} allowedRoles={["parent", "student"]}>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute session={session} allowedRoles={["parent", "student"]}>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function Navbar({ session, pathname, onLogout }) {
  const dashboardPath =
    session?.role === "parent"
      ? "/parent-dashboard"
      : session?.role === "student"
        ? "/kid-dashboard"
        : session?.role === "admin"
          ? "/admin-dashboard"
          : null;
  const dashboardLabel =
    session?.role === "parent"
      ? "Parent Dashboard"
      : session?.role === "student"
        ? "Kid Dashboard"
        : session?.role === "admin"
          ? "Admin Dashboard"
          : "Dashboard";

  return (
    <header className="nav-shell">
      <nav className="topbar glass-panel section-shell">
        <Link className="brand-mark" to="/">
          <span className="brand-mark__badge">EK</span>
          <div>
            <p className="eyebrow">India-friendly learning flow</p>
            <h1>Edtech for Kids</h1>
          </div>
        </Link>

        <div className="topbar__links">
          <NavLink to="/" className={navClassName}>
            Home
          </NavLink>

          {!session ? (
            <>
              <NavLink to="/register" className={navClassName}>
                Parent Register
              </NavLink>
              <NavLink to="/parent-login" className={navClassName}>
                Parent Login
              </NavLink>
              <NavLink to="/kid-login" className={navClassName}>
                Kid Login
              </NavLink>
              <NavLink to="/admin-login" className={navClassName}>
                Admin
              </NavLink>
            </>
          ) : null}

          {session && dashboardPath && pathname !== dashboardPath ? (
            <NavLink to={dashboardPath} className={navClassName}>
              {dashboardLabel}
            </NavLink>
          ) : null}

          {session ? (
            <button type="button" className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

function navClassName({ isActive }) {
  return `nav-link ${isActive ? "nav-link--active" : ""}`;
}

function ProtectedRoute({ session, allowedRoles, children }) {
  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function HomePage({ session }) {
  const [selectedLearner, setSelectedLearner] = useState(learners[0].id);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const activeLearner = learners.find((learner) => learner.id === selectedLearner);
  const activeSubject = subjects.find((subject) => subject.id === selectedSubject);

  const quizScore = useMemo(() => {
    return quizQuestions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.answer ? score + 1 : score;
    }, 0);
  }, [selectedAnswers]);

  const quizProgress = Math.round(
    (Object.keys(selectedAnswers).length / quizQuestions.length) * 100,
  );

  return (
    <main>
      <header className="hero section-shell">
        <section className="hero__content">
          <div className="hero__copy">
            <span className="pill">Children use parent-linked access instead of their own email</span>
            <h2 className="text-display">
              Safe, playful learning for kids and simple tracking for parents.
            </h2>
            <p>
              Edtech for Kids is designed for the Indian use case where children under
              13 should not rely on personal email accounts. Parents register, add
              children, and track every quiz and learning milestone from one place.
            </p>
            <div className="hero__actions">
              <Link className="primary-btn" to="/register">
                Register as parent
              </Link>
              <Link className="secondary-btn" to="/kid-login">
                Kid login with parent email
              </Link>
            </div>
            <div className="hero__stats">
              <div className="stat-card glass-panel">
                <strong>Parent-led</strong>
                <span>Only parents create accounts</span>
              </div>
              <div className="stat-card glass-panel">
                <strong>Child safe</strong>
                <span>No child email required</span>
              </div>
              <div className="stat-card glass-panel">
                <strong>{session ? "Live" : "Ready"}</strong>
                <span>{session ? `Logged in as ${session.role}` : "Login flows built"}</span>
              </div>
            </div>
          </div>

          <div className="hero__board glass-panel">
            <div className="board__header">
              <p>Today&apos;s learning trail</p>
              <span>Earn 105 stars</span>
            </div>
            <div className="board__path">
              {missions.map((mission, index) => (
                <div className="path-step" key={mission.title}>
                  <div className="path-step__icon">{index + 1}</div>
                  <div>
                    <strong>{mission.title}</strong>
                    <p>{mission.detail}</p>
                  </div>
                  <span>{mission.reward}</span>
                </div>
              ))}
            </div>
            <div className="mascot-card">
              <div className="mascot-card__emoji">🦊</div>
              <div>
                <strong>Parent control</strong>
                <p>Parents add kids, create child PINs, and monitor performance.</p>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section className="section-shell auth-strip">
        <div className="auth-strip__card glass-panel">
          <strong>Parent registration</strong>
          <p>Create the main family account and add the first child.</p>
          <Link to="/register">Open parent register</Link>
        </div>
        <div className="auth-strip__card glass-panel">
          <strong>Kids login</strong>
          <p>Use parent email, child name, and parent-created PIN.</p>
          <Link to="/kid-login">Open kid login</Link>
        </div>
        <div className="auth-strip__card glass-panel">
          <strong>Admin dashboard</strong>
          <p>Self-registration is disabled. Admins use secure login only.</p>
          <Link to="/admin-login">Open admin login</Link>
        </div>
      </section>

      <section className="section-shell learner-section">
        <div className="section-heading">
          <span className="eyebrow">Choose a learner mode</span>
          <h3 className="text-display">Age-friendly journeys with the right pace</h3>
        </div>

        <div className="learner-grid">
          {learners.map((learner) => (
            <button
              key={learner.id}
              type="button"
              className={`learner-card glass-panel ${
                selectedLearner === learner.id ? "learner-card--active" : ""
              }`}
              onClick={() => setSelectedLearner(learner.id)}
            >
              <span className="learner-card__emoji">{learner.emoji}</span>
              <strong>{learner.name}</strong>
              <span>{learner.age}</span>
              <p>{learner.description}</p>
            </button>
          ))}
        </div>

        <div className="focus-banner">
          <strong>{activeLearner?.name}</strong>
          <span>{activeLearner?.description}</span>
        </div>
      </section>

      <section className="section-shell subject-section">
        <div className="section-heading">
          <span className="eyebrow">Core learning worlds</span>
          <h3 className="text-display">Bright topics that keep attention high</h3>
        </div>

        <div className="subject-grid">
          <div className="subject-list">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                className={`subject-card subject-card--${subject.theme} ${
                  selectedSubject === subject.id ? "subject-card--active" : ""
                }`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <div className="subject-card__top">
                  <span className="subject-card__icon">{subject.icon}</span>
                  <span>{subject.duration}</span>
                </div>
                <strong>{subject.name}</strong>
                <p>{subject.headline}</p>
                <div className="progress-track">
                  <div
                    className="progress-track__fill"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
                <small>{subject.progress}% completed</small>
              </button>
            ))}
          </div>

          <article className="subject-spotlight glass-panel">
            <div className="subject-spotlight__title">
              <span>{activeSubject?.icon}</span>
              <div>
                <p className="eyebrow">Featured lesson</p>
                <h4>{activeSubject?.name}</h4>
              </div>
            </div>
            <h5>{activeSubject?.concept}</h5>
            <p>{activeSubject?.story}</p>
            <div className="skill-pills">
              {activeSubject?.skills.map((skill) => (
                <span className="skill-pill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="challenge-box">
              <strong>Mission challenge</strong>
              <p>{activeSubject?.challenge}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-shell mission-section">
        <div className="section-heading">
          <span className="eyebrow">Why kids stay interested</span>
          <h3 className="text-display">Short bursts, instant rewards, and story-led teaching</h3>
        </div>

        <div className="feature-grid">
          <article className="feature-card glass-panel">
            <strong>Animated explanations</strong>
            <p>Every topic opens with a simple story so children understand before memorizing.</p>
          </article>
          <article className="feature-card glass-panel">
            <strong>Kid login without child email</strong>
            <p>Parents create access using their email and a child PIN, which fits your requirement.</p>
          </article>
          <article className="feature-card glass-panel">
            <strong>Parent performance tracking</strong>
            <p>Parents can view quiz count, average score, pass rate, and recent attempts.</p>
          </article>
        </div>
      </section>

      <section className="section-shell quiz-section">
        <div className="section-heading">
          <span className="eyebrow">Quiz arena</span>
          <h3 className="text-display">Quick checks that feel fun, not scary</h3>
        </div>

        <div className="quiz-layout">
          <div className="quiz-list">
            {quizQuestions.map((item) => (
              <article className="quiz-card glass-panel" key={item.id}>
                <span className="quiz-card__count">Question {item.id}</span>
                <h4>{item.question}</h4>
                <div className="quiz-options">
                  {item.options.map((option) => {
                    const isSelected = selectedAnswers[item.id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`quiz-option ${isSelected ? "quiz-option--selected" : ""}`}
                        onClick={() =>
                          setSelectedAnswers((current) => ({
                            ...current,
                            [item.id]: option,
                          }))
                        }
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <aside className="quiz-score glass-panel">
            <p className="eyebrow">Live result</p>
            <h4>{quizScore} / {quizQuestions.length}</h4>
            <span>Questions correct</span>
            <div className="progress-track progress-track--large">
              <div
                className="progress-track__fill"
                style={{ width: `${quizProgress}%` }}
              />
            </div>
            <p>{quizProgress}% attempted</p>
            <div className="score-note">
              {quizScore === quizQuestions.length
                ? "Amazing work. You unlocked a perfect-score badge."
                : "Keep going. Each answer builds confidence."}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell parent-section">
        <div className="section-heading">
          <span className="eyebrow">Parent dashboard preview</span>
          <h3 className="text-display">Simple progress tracking without overwhelming charts</h3>
        </div>

        <div className="parent-layout">
          <div className="parent-metrics">
            {parentHighlights.map((item) => (
              <article className="metric-card glass-panel" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <article className="parent-summary glass-panel">
            <h4>How the access model works</h4>
            <p>
              Parents register with their own email. Children never need their own email.
              Parents add child profiles and create a child PIN for login access.
            </p>
            <ul>
              <li>Parent-only registration</li>
              <li>Kid login with parent email + child name + PIN</li>
              <li>Admin dashboard with no public admin registration</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

function ParentRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    parentName: "",
    parentEmail: "",
    password: "",
    childName: "",
    class: "3",
    studentPin: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          name: form.parentName,
          email: form.parentEmail,
          password: form.password,
          role: "parent",
        });
      } catch (error) {
        if (error.response?.data?.message !== "Email already registered") {
          throw error;
        }
      }

      await axios.post(`${API_URL}/auth/register`, {
        name: form.childName,
        class: Number(form.class),
        parentEmail: form.parentEmail,
        studentPin: form.studentPin,
        role: "student",
      });

      setStatus({
        loading: false,
        message: "Parent email is ready and the child profile was created. Please login now.",
      });
      navigate("/parent-login");
    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <section className="page-shell section-shell">
      <div className="section-heading">
        <span className="eyebrow">Parent registration only</span>
        <h2 className="text-display">Create the family account and first child access</h2>
      </div>
      <form className="auth-card glass-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Parent name">
            <input
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              placeholder="Mother or father name"
              required
            />
          </FormField>
          <FormField label="Parent email">
            <input
              type="email"
              name="parentEmail"
              value={form.parentEmail}
              onChange={handleChange}
              placeholder="parent@example.com"
              required
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </FormField>
          <FormField label="Child name">
            <input
              name="childName"
              value={form.childName}
              onChange={handleChange}
              placeholder="Child name"
              required
            />
          </FormField>
          <FormField label="Class">
            <select name="class" value={form.class} onChange={handleChange}>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
          </FormField>
          <FormField label="Child access PIN">
            <input
              name="studentPin"
              value={form.studentPin}
              onChange={handleChange}
              placeholder="4 or 6 digit PIN"
              required
            />
          </FormField>
        </div>
        <p className="form-note">
          Children do not register with their own email. The parent creates access and tracks performance.
        </p>
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? "Creating account..." : "Register parent"}
        </button>
        {status.message ? <p className="status-message">{status.message}</p> : null}
      </form>
    </section>
  );
}

function ParentLoginPage({ onLoginSuccess }) {
  return (
    <AccountLoginPage
      eyebrow="Parent login"
      title="Login to track your child performance"
      description="Parents can review quiz history, add children, and monitor progress."
      submitLabel="Login as parent"
      request={async (form) => {
        const response = await axios.post(`${API_URL}/auth/login`, form);

        if (response.data.role !== "parent") {
          throw new Error("Parent account not found");
        }

        return {
          ...response.data,
          students: (response.data.students || []).map(sanitizeStudent),
        };
      }}
      onLoginSuccess={onLoginSuccess}
      redirectTo="/parent-dashboard"
    />
  );
}

function AdminLoginPage({ onLoginSuccess }) {
  return (
    <AccountLoginPage
      eyebrow="Admin login"
      title="Secure admin access only"
      description="Admin self-registration is disabled. Only existing admin credentials can login."
      submitLabel="Login as admin"
      request={async (form) => {
        const response = await axios.post(`${API_URL}/auth/login`, form);

        if (response.data.role !== "admin") {
          throw new Error("Admin account not found");
        }

        return response.data;
      }}
      onLoginSuccess={onLoginSuccess}
      redirectTo="/admin-dashboard"
    />
  );
}

function AccountLoginPage({
  eyebrow,
  title,
  description,
  submitLabel,
  request,
  onLoginSuccess,
  redirectTo,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const newSession = await request(form);
      onLoginSuccess(newSession);
      navigate(redirectTo);
      setStatus({ loading: false, message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || error.message || "Login failed",
      });
    }
  };

  return (
    <section className="page-shell section-shell">
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-display">{title}</h2>
      </div>
      <form className="auth-card glass-panel auth-card--compact" onSubmit={handleSubmit}>
        <p className="form-note">{description}</p>
        <FormField label="Email">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </FormField>
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? "Checking..." : submitLabel}
        </button>
        {status.message ? <p className="status-message">{status.message}</p> : null}
      </form>
    </section>
  );
}

function KidLoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    parentEmail: "",
    studentName: "",
    studentPin: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const payload = {
        parentEmail: form.parentEmail.trim(),
        studentName: form.studentName.trim(),
        studentPin: form.studentPin.trim(),
      };

      const response = await axios.post(`${API_URL}/auth/student-login`, payload);
      onLoginSuccess({ ...response.data, role: "student" });
      navigate("/kid-dashboard");
      setStatus({ loading: false, message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || "Kid login failed",
      });
    }
  };

  return (
    <section className="page-shell section-shell">
      <div className="section-heading">
        <span className="eyebrow">Kids login</span>
        <h2 className="text-display">Login with parent email and child PIN</h2>
      </div>
      <form className="auth-card glass-panel auth-card--compact" onSubmit={handleSubmit}>
        <p className="form-note">
          This login avoids child email accounts. Parents create the child profile and PIN.
        </p>
        <FormField label="Parent email">
          <input
            type="email"
            name="parentEmail"
            value={form.parentEmail}
            onChange={handleChange}
            placeholder="Parent email"
            required
          />
        </FormField>
        <FormField label="Child name">
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Child name"
            required
          />
        </FormField>
        <FormField label="Child PIN">
          <input
            name="studentPin"
            value={form.studentPin}
            onChange={handleChange}
            placeholder="Parent-created PIN"
            required
          />
        </FormField>
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? "Logging in..." : "Login as kid"}
        </button>
        {status.message ? <p className="status-message">{status.message}</p> : null}
      </form>
    </section>
  );
}

function ParentDashboard({ session, onSessionUpdate }) {
  return (
    <ParentDashboardPage
      session={session}
      onSessionUpdate={onSessionUpdate}
    />
  );
}

function KidDashboard({ session }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const classLevel = Number(session?.class) || 1;

  const baseLessons = [
    {
      id: "math-video",
      title: "Math Counting Fun",
      topic: "Math",
      icon: "➕",
      headline: "Watch counting, numbers, and simple addition for class 1.",
      lessonTitle: "Count Numbers 1 to 10",
      videoUrl: "https://www.youtube.com/embed/bGetqbqDVaA",
    },
    {
      id: "science-video",
      title: "Science Plants Around Us",
      topic: "Science",
      icon: "🔬",
      headline: "Learn leaves, roots, stem, and how plants grow.",
      lessonTitle: "Parts of a Plant",
      videoUrl: "https://www.youtube.com/embed/p3St51F4kE8",
    },
    {
      id: "english-video",
      title: "English Alphabet Adventure",
      topic: "English",
      icon: "📚",
      headline: "Practice letters, easy words, and sounds for beginners.",
      lessonTitle: "Alphabet and Simple Words",
      videoUrl: "https://www.youtube.com/embed/75p-N9YKqNo",
    },
  ];

  const lessonOverridesByClass = {
    2: {
      Math: {
        videoUrl: "https://www.youtube.com/embed/xJ5w5WQBhO0",
        title: "Fun Division with Numberblocks",
        headline: "Learn simple division using friendly Numberblocks characters.",
        lessonTitle: "Division Stories for Class 2",
      },
      Science: {
        videoUrl: "https://www.youtube.com/embed/QmQvdUaH7hE",
        title: "Living and Non‑Living Things",
        headline: "Understand how to tell if something is living or non‑living.",
        lessonTitle: "Living vs Non‑Living (Class 2 Science)",
      },
      English: {
        videoUrl: "https://www.youtube.com/embed/4DLxGFDwFAY",
        title: "Prepositions for Kids",
        headline: "Learn in, on, under and more prepositions with simple class 2 examples.",
        lessonTitle: "Prepositions in Everyday Sentences",
      },
    },
  };

  const lessons = baseLessons.map((lesson) => {
    const overridesForClass = lessonOverridesByClass[classLevel] || {};
    const overridesForTopic = overridesForClass[lesson.topic];
    return overridesForTopic ? { ...lesson, ...overridesForTopic } : lesson;
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_URL}/results/progress/${session._id}`);
        setProgress(response.data);
      } catch {
        setProgress(null);
      }
    };

    fetchProgress();
  }, [session._id]);

  const startSubjectQuiz = (topic) => {
    navigate("/quiz", {
      state: {
        student: session,
        topic,
        returnTo: "/kid-dashboard",
      },
    });
  };

  return (
    <section className="page-shell section-shell">
      <div className="dashboard-hero glass-panel">
        <div>
          <p className="eyebrow">Kid dashboard</p>
          <h2 className="text-display">Hi {session?.name}, let&apos;s learn today</h2>
          <p className="dashboard-copy">
            Your login uses your parent&apos;s email and your own child PIN, so you do not need a personal email account.
          </p>
        </div>
        <div className="hero__stats dashboard-hero__stats">
          <div className="stat-card glass-panel">
            <strong>Class {session?.class}</strong>
            <span>Current grade</span>
          </div>
          <div className="stat-card glass-panel">
            <strong>{progress?.averageScore ?? 0}%</strong>
            <span>Average score</span>
          </div>
          <div className="stat-card glass-panel">
            <strong>{progress?.totalQuizzes ?? 0}</strong>
            <span>Quizzes done</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="section-heading">
          <span className="eyebrow">Video lessons</span>
          <h3 className="text-display">Watch subject-wise lessons and then take the related quiz</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => (
            <article className="glass-panel rounded-3xl p-5 shadow-sm" key={lesson.id}>
              <div className="mb-4">
                <strong>
                  {lesson.icon} {lesson.title}
                </strong>
                <p className="mt-2">{lesson.headline}</p>
              </div>

              <div className="mb-4 overflow-hidden rounded-2xl">
                <iframe
                  width="100%"
                  height="220"
                  src={lesson.videoUrl}
                  title={lesson.lessonTitle}
                  allowFullScreen
                />
              </div>

              <p className="mb-4 font-medium">{lesson.lessonTitle}</p>

              <button
                type="button"
                className="primary-btn"
                onClick={() => startSubjectQuiz(lesson.topic)}
              >
                Start {lesson.topic} Quiz
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminDashboard() {
  return <AdminDashboardPage />;
}

function FormField({ label, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default App;

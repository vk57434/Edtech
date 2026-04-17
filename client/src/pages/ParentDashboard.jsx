import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:5000/api";
const SUBJECTS_BY_CLASS = {
  1: ["Math", "English", "EVS"],
  2: ["Math", "English", "EVS"],
  3: ["Math", "English", "Science"],
  4: ["Math", "English", "Science"],
  5: ["Math", "English", "Science"],
  6: ["Math", "Science", "English", "Social Studies"],
  7: ["Math", "Science", "English", "Social Studies"],
  8: ["Math", "Science", "English", "Social Studies"],
  9: ["Math", "Science", "English"],
  10: ["Math", "Science", "English"],
};

export default function ParentDashboard({ session, onSessionUpdate }) {
  const navigate = useNavigate();
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const storedStudents = (() => {
    try {
      return JSON.parse(localStorage.getItem("students")) || [];
    } catch {
      return [];
    }
  })();
  const parentUser = session || storedUser;
  const initialStudents = session?.students || storedStudents;

  const [students, setStudents] = useState(() => {
    return initialStudents;
  });
  const [selectedStudent, setSelectedStudent] = useState(
    () => initialStudents[0]?._id || ""
  );
  const [progress, setProgress] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [childForm, setChildForm] = useState({
    name: "",
    class: "3",
    studentPin: "",
  });
  const [childStatus, setChildStatus] = useState("");
  const [pinForm, setPinForm] = useState({ studentPin: "" });
  const [pinStatus, setPinStatus] = useState("");

  useEffect(() => {
    if (!parentUser || parentUser.role !== "parent") {
      navigate("/login");
    }
  }, [navigate, parentUser]);

  //------------------------------------------------
  // FETCH PROGRESS
  //------------------------------------------------

  useEffect(() => {
    if (!selectedStudent) {
      return;
    }

    const fetchStudentData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/results/progress/${selectedStudent}`
        );
        setProgress(res.data);
      } catch {
        setProgress(null);
      }

      try {
        const subRes = await axios.get(
          `http://localhost:5000/api/students/${selectedStudent}/subjects`
        );
        setSubjects(subRes.data.subjects || null);
      } catch {
        const current = students.find((s) => s._id === selectedStudent);
        const fallback =
          SUBJECTS_BY_CLASS[Number(current?.class)] ||
          ["Math", "Science", "English"];
        setSubjects(fallback);
      }
    };

    fetchStudentData();
  }, [selectedStudent, students]);

  const handleStudentChange = (id) => {
    setSelectedStudent(id);
  };

  //------------------------------------------------

  const syncParentSession = (nextStudents) => {
    const nextParent = {
      ...(parentUser || {}),
      students: nextStudents,
    };
    setStudents(nextStudents);
    localStorage.setItem("user", JSON.stringify(nextParent));
    localStorage.setItem("students", JSON.stringify(nextStudents));
    if (onSessionUpdate) {
      onSessionUpdate(nextParent);
    }
  };

  const handleChildFormChange = (event) => {
    setChildForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePinChange = (event) => {
    setPinForm({ studentPin: event.target.value });
  };

  const addChild = async (event) => {
    event.preventDefault();
    setChildStatus("Adding child...");

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: childForm.name,
        class: Number(childForm.class),
        parentEmail: parentUser?.email,
        studentPin: childForm.studentPin,
        role: "student",
      });

      const nextStudents = [...students, response.data];
      syncParentSession(nextStudents);
      setSelectedStudent(response.data._id);
      setChildForm({ name: "", class: "3", studentPin: "" });
      setChildStatus("Child added successfully.");
    } catch (error) {
      setChildStatus(error.response?.data?.message || "Unable to add child.");
    }
  };

  const updateChildPin = async (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      setPinStatus("Select a child first.");
      return;
    }

    setPinStatus("Updating PIN...");

    try {
      const response = await axios.patch(`${API_URL}/auth/student-pin`, {
        parentEmail: parentUser?.email,
        studentId: selectedStudent,
        studentPin: pinForm.studentPin,
      });
      setPinForm({ studentPin: "" });
      setPinStatus(response.data.message || "Child PIN updated.");
    } catch (error) {
      setPinStatus(error.response?.data?.message || "Unable to update PIN.");
    }
  };

  //------------------------------------------------

  const startQuiz = () => {
    if (!selectedStudent) {
      alert("Select a student");
      return;
    }

    const student = students.find((s) => s._id === selectedStudent);

    navigate("/quiz", {
      state: {
        student,
        returnTo: "/parent-dashboard",
      },
    });
  };

  //------------------------------------------------

  return (
    <div className="min-h-screen p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        👨‍👩‍👧 Parent Dashboard
      </h1>

      {/* STUDENT SELECT CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
        <label className="font-semibold block mb-2">
          Select Student
        </label>

        <select
          value={selectedStudent}
          onChange={(e) => handleStudentChange(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select student</option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} (Class {student.class})
            </option>
          ))}
        </select>

        <button
          onClick={startQuiz}
          className="w-full bg-blue-600 text-white py-2 rounded-lg 
                     hover:bg-blue-700 transition"
        >
          ▶ Start Quiz
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">➕ Add Another Child</h2>
          <form onSubmit={addChild} className="space-y-3">
            <input
              name="name"
              value={childForm.name}
              onChange={handleChildFormChange}
              placeholder="Child name"
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="class"
              value={childForm.class}
              onChange={handleChildFormChange}
              className="border p-2 rounded w-full"
            >
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
            <input
              name="studentPin"
              value={childForm.studentPin}
              onChange={handleChildFormChange}
              placeholder="Create child PIN"
              className="border p-2 rounded w-full"
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Add Child With Same Parent Email
            </button>
          </form>
          {childStatus ? <p className="mt-3 text-sm text-blue-700">{childStatus}</p> : null}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">🔑 Reset Child PIN</h2>
          <form onSubmit={updateChildPin} className="space-y-3">
            <input
              name="studentPin"
              value={pinForm.studentPin}
              onChange={handlePinChange}
              placeholder="New PIN for selected child"
              className="border p-2 rounded w-full"
              required
            />
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
              Update PIN
            </button>
          </form>
          {pinStatus ? <p className="mt-3 text-sm text-purple-700">{pinStatus}</p> : null}
        </div>
      </div>

      {selectedStudent && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-[400px]">
          <h2 className="text-xl font-bold mb-3">📚 Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {(subjects || []).map((subject) => (
              <span
                key={subject}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= PROGRESS ================= */}

      {progress && (
        <div className="mt-10 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">
            📊 Student Progress
          </h2>

          {/* STATS */}
          <div className="flex gap-6 mb-10">
            <StatCard title="Total Quizzes" value={progress.totalQuizzes} color="blue" />
            <StatCard title="Average Score" value={`${progress.averageScore || 0}%`} color="green" />
            <StatCard title="Pass Rate" value={`${progress.passRate || 0}%`} color="purple" />
          </div>

          {/* Weak Subjects */}
          {progress.weakSubjects?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">⚠ Weak Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {progress.weakSubjects.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-red-100 text-red-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subject Averages */}
          {progress.subjectAverages && Object.keys(progress.subjectAverages).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">📚 Subject Averages</h3>
              <table className="w-full border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Subject</th>
                    <th className="border p-2 text-left">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(progress.subjectAverages).map(([subj, avg]) => (
                    <tr key={subj}>
                      <td className="border p-2">{subj}</td>
                      <td className="border p-2">{avg}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CHART */}
          {progress.history?.length > 0 && (
            <LineChart
              width={700}
              height={300}
              data={progress.history.map((r, i) => ({
                name: `Quiz ${i + 1}`,
                score: Math.round((r.score / r.total) * 100),
              }))}
            >
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" />
            </LineChart>
          )}
        </div>
      )}
    </div>
  );
}

// 🔥 Reusable Stat Card
function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className={`${colors[color]} p-6 rounded-lg w-52`}>
      <p>{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}

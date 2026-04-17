import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔁 Auto redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "parent") {
      navigate("/parent-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      form
    );

    // 🔑 ADMIN LOGIN
    if (res.data.role === "admin") {
      localStorage.setItem("user", JSON.stringify(res.data));
      alert(`✅ Welcome ${res.data.name}`);
      navigate("/admin-dashboard");
      return;
    }

    // 🔑 PARENT LOGIN (WITH STUDENTS)
    if (res.data.role === "parent") {
      // ✅ parent data is DIRECTLY in res.data
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ students are also directly attached
      localStorage.setItem("students", JSON.stringify(res.data.students));

      alert(`✅ Welcome ${res.data.name}`);
      navigate("/parent-dashboard");
      return;
    }

  } catch {
    alert("❌ Invalid email or password");
  }
};

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="button"
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

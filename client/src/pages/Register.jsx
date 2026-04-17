import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    class: "",
    parentEmail: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      let payload = {
        name: form.name,
        role: form.role,
      };

      if (form.role === "parent") {
        payload.email = form.email;
        payload.password = form.password;
      }

      if (form.role === "student") {
        payload.class = Number(form.class);
        payload.parentEmail = form.parentEmail;
      }

      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("✅ Registered Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Registration Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-2xl font-bold text-center mb-4">📝 Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Role */}
        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>

        {/* Parent fields */}
        {form.role === "parent" && (
          <>
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
              className="w-full mb-3 p-2 border rounded"
            />
          </>
        )}

        {/* Student fields */}
        {form.role === "student" && (
          <>
            <select
              name="class"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            >
              <option value="">Select Class</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>

            <input
              name="parentEmail"
              placeholder="Parent Email"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            />
          </>
        )}

        <button
          onClick={register}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

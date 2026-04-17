import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Courses() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get("http://localhost:5000/api/courses")
      .then(res => setCourses(res.data));

  }, []);

  return (
    <div className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-10 text-center">
        🎓 Choose a Course
      </h1>

      <div className="grid grid-cols-4 gap-8">

        {courses.map(course => (

          <div
            key={course._id}
            onClick={() => navigate("/parent-dashboard", { state:{course} })}
            className="bg-white rounded-3xl p-6 shadow-md 
                       hover:shadow-2xl hover:scale-105 
                       transition cursor-pointer"
          >

            <img
              src={course.image}
              className="h-32 mx-auto mb-4"
            />

            <h2 className="text-xl font-bold text-center">
              {course.title}
            </h2>

            <p className="text-gray-500 text-center">
              {course.description}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <div className="p-6 min-h-screen">

      <h1 className="text-3xl font-bold text-green-600 mb-6">
        🎒 Student Dashboard
      </h1>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">📘 Subjects</h2>
          <p>Math, Science, English</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">📝 Quiz Progress</h2>
          <p>Completed: <b>6 / 10</b></p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">⭐ Overall Score</h2>
          <p><b>80%</b></p>
        </div>
      </div>

      {/* Learning Activities */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          📚 Learning Activities
        </h2>

        <ul className="space-y-3">
          <li className="border p-3 rounded">
            📘 Math – Fractions (Completed)
          </li>
          <li className="border p-3 rounded">
            🔬 Science – Plants (In Progress)
          </li>
          <li className="border p-3 rounded">
            📖 English – Grammar (Pending)
          </li>
        </ul>
      </div>

      {/* Quiz Scores */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          📊 Quiz Scores
        </h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Math</td>
              <td className="border p-2">85%</td>
              <td className="border p-2 text-green-600">Excellent</td>
            </tr>
            <tr>
              <td className="border p-2">Science</td>
              <td className="border p-2">78%</td>
              <td className="border p-2 text-yellow-600">Good</td>
            </tr>
            <tr>
              <td className="border p-2">English</td>
              <td className="border p-2">82%</td>
              <td className="border p-2 text-green-600">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

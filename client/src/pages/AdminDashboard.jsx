import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users")
      .then((res) => setParents(res.data.parentData || []))
      .catch(() => setParents([]))
      .finally(() => setLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredParents = normalizedQuery
    ? parents.filter((p) => {
        const name = String(p.name || "").toLowerCase();
        const email = String(p.email || "").toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      })
    : parents;

  const totalParents = parents.length;
  const totalStudents = parents.reduce((acc, p) => acc + (p.children?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8 sm:px-8">
      <header className="mx-auto mb-8 max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-indigo-600">
              Admin Control Center
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Monitor parent accounts and student performance at a glance.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Total Parents
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {totalParents}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Total Students
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {totalStudents}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Search
            </p>
            <div className="mt-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by parent name or email"
                className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Loading...</h2>
            <p className="mt-1 text-sm text-slate-600">
              Fetching parents and student performance.
            </p>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">No results</h2>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search term.
            </p>
          </div>
        ) : (
          filteredParents.map((parent) => (
            <section
              key={parent._id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {parent.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{parent.email}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    {String(parent.name || "P").trim().charAt(0).toUpperCase()}
                  </span>
                  <span>{parent.children?.length || 0} students</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                      <th className="whitespace-nowrap px-5 py-3">Student</th>
                      <th className="whitespace-nowrap px-5 py-3">Class</th>
                      <th className="whitespace-nowrap px-5 py-3">Quizzes</th>
                      <th className="whitespace-nowrap px-5 py-3">Average</th>
                      <th className="whitespace-nowrap px-5 py-3">Weak Subjects</th>
                      <th className="whitespace-nowrap px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(parent.children || []).map((student) => (
                      <StudentRow key={student._id} student={student} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}


/* =====================================================
   ⭐ STUDENT ROW WITH PROGRESS
===================================================== */

function StudentRow({ student }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/results/progress/${student._id}`)
      .then((res) => setProgress(res.data))
      .catch(() =>
        setProgress({
          totalQuizzes: 0,
          averageScore: 0,
          weakSubjects: [],
        })
      );
  }, [student._id]);

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
        {student.name}
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
        {student.class}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-bold text-indigo-700">
        {progress ? progress.totalQuizzes : "—"}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-bold text-emerald-700">
        {progress ? `${Math.round(progress.averageScore)}%` : "—"}
      </td>

      <td className="px-5 py-4">
        {progress?.weakSubjects?.length ? (
          <div className="flex flex-wrap gap-1">
            {progress.weakSubjects.map((s) => (
              <span
                key={s}
                className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-100"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        {progress ? (
          progress.averageScore >= 40 ? (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
              Good
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-100">
              Needs Help
            </span>
          )
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>
    </tr>
  );
}

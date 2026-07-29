import { useEffect, useState } from "react";
import { BASE_URL } from "../api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch courses
  const fetchCourses = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/courses${query ? `?search=${query}` : ""}`,
      );
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Courses</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </form>

      {/* Loading */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <table className="w-full border border-slate-200 text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Seats</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="even:bg-slate-50">
                <td className="p-2 border">{course.id}</td>
                <td className="p-2 border">{course.name}</td>
                <td className="p-2 border">${course.fee}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      course.seatsAvailable > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {course.seatsAvailable} / {course.seatsTotal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

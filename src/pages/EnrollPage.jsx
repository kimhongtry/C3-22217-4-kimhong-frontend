import { useEffect, useState } from "react";
import { BASE_URL } from "../api";

export default function EnrollPage() {
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/courses`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cannot load courses");
      }

      setCourses(data);

      // select first course automatically
      if (data.length > 0) {
        setCourseId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Run when page opens
  useEffect(() => {
    fetchCourses();
  }, []);

  // Enroll student
  const handleEnroll = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/enrollments`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: Number(studentId),
          courseId: Number(courseId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

      setSuccess("Enrollment successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-6">Enroll a student</h1>

      <form onSubmit={handleEnroll} className="space-y-4 max-w-md">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Student ID
          </label>

          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="
              mt-1 w-full rounded
              border border-slate-300
              px-3 py-2
            "
            required
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Course
          </label>

          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="
              mt-1 w-full rounded
              border border-slate-300
              px-3 py-2
            "
          >
            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
                disabled={course.seatsAvailable === 0}
              >
                {course.name}
                (${course.fee}) — {course.seatsAvailable} seats left
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="
            w-full rounded
            bg-blue-600
            px-4 py-2
            text-white
            hover:bg-blue-700
          "
        >
          Enroll
        </button>

        {success && (
          <div
            className="
            rounded bg-green-100
            p-3 text-green-700
          "
          >
            ✅ {success}
          </div>
        )}

        {error && (
          <div
            className="
            rounded bg-red-100
            p-3 text-red-700
          "
          >
            ❌ Error: {error}
          </div>
        )}
      </form>
    </section>
  );
}

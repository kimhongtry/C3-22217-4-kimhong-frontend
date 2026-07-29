import { useState } from "react";
import { BASE_URL } from "../api";

export default function StudentPage() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // GET /students/:id
  const loadStudent = async () => {
    if (!studentId) {
      setError("Please enter student ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/students/${studentId}`);

      const data = await response.json();

      console.log("Student API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Student not found");
      }

      setStudent(data);
    } catch (err) {
      setStudent(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT /enrollments/:id/drop
  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/enrollments/${enrollmentId}/drop`,
        {
          method: "PUT",
        },
      );

      const data = await response.json();

      console.log("Drop API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to drop enrollment");
      }

      // reload student after drop
      loadStudent();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Lookup</h1>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="
            border rounded-lg
            px-4 py-2
            w-64
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          onClick={loadStudent}
          className="
            bg-blue-600
            text-white
            px-6 py-2
            rounded-lg
            hover:bg-blue-700
          "
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
          bg-red-100
          text-red-700
          border border-red-400
          p-4 rounded-lg mb-5
        "
        >
          ❌ {error}
        </div>
      )}

      {/* Student */}
      {student && (
        <div>
          <div
            className="
            bg-white
            shadow-md
            rounded-xl
            p-6
            mb-8
            border
          "
          >
            <h2 className="text-xl font-bold mb-3">Student Information</h2>

            <p>
              <b>Name:</b> {student.name}
            </p>

            <p>
              <b>Email:</b> {student.email}
            </p>

            <p>
              <b>Phone:</b> {student.phone}
            </p>
          </div>

          <table
            className="
            w-full
            border
          "
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Course</th>

                <th className="border p-3">Fee</th>

                <th className="border p-3">Date</th>

                <th className="border p-3">Status</th>

                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {student.enrollments.map((item) => (
                <tr key={item.id}>
                  <td className="border p-3">{item.course.name}</td>

                  <td className="border p-3">${item.course.fee}</td>

                  <td className="border p-3">{item.enrollDate}</td>

                  <td className="border p-3">
                    {item.status === "ACTIVE" ? (
                      <span
                        className="
                        bg-green-100
                        text-green-700
                        px-3 py-1
                        rounded-full
                      "
                      >
                        ACTIVE
                      </span>
                    ) : (
                      <span
                        className="
                        bg-gray-200
                        text-gray-700
                        px-3 py-1
                        rounded-full
                      "
                      >
                        DROPPED
                      </span>
                    )}
                  </td>

                  <td className="border p-3">
                    {item.status === "ACTIVE" && (
                      <button
                        onClick={() => dropEnrollment(item.id)}
                        className="
                          bg-red-500
                          text-white
                          px-4 py-1
                          rounded
                          hover:bg-red-600
                        "
                      >
                        Drop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

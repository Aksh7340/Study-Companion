import { useState, useEffect } from "react";
import ExamList from "../Components/Exams/ExamList";
import WeakChapters from "../Components/Analytics/WeakChapters";
import WeakSubjects from "../Components/Analytics/WeakSubjects";

export default function Dashboard({
  examData = [],
  deleteExam,
  subjects = []
}) {

  // ✅ NEW: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ NEW: Simulate data loading (in real app, this comes from API)
    // Simulate delay to show loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Track your exam preparation and identify weak areas.
        </p>
      </div>

      {/* ✅ NEW: Loading State */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      ) 
      
      /* ✅ NEW: Error State */
      : error ? (
        <div className="bg-red-50 p-8 rounded-xl shadow-sm border border-red-200 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )

      /* ✅ NEW: Empty State */
      : examData.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-600 mb-4">
            No exams added yet.
          </p>

          <p className="text-sm text-gray-500">
            Go to Setup and create your first exam to start planning your study.
          </p>
        </div>
      ) 
      
      /* Content */
      : (
        <div className="space-y-10">

          {/* Exams Section */}
          <section>

            <h2 className="text-xl font-semibold mb-4">
              Your Exams
            </h2>

            <div className="bg-white rounded-xl shadow-sm p-6">

              <ExamList
                examData={examData}
                deleteExam={deleteExam}
                subjects={subjects}
              />

            </div>

          </section>

          {/* Analytics Section */}
          <section>

            <h2 className="text-xl font-semibold mb-6">
              Study Insights
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <WeakSubjects
                  subjects={subjects}
                  examId={examData[0]?._id}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <WeakChapters
                  subjects={subjects}
                />
              </div>

            </div>

          </section>

        </div>

      )}

    </div>

  );

}

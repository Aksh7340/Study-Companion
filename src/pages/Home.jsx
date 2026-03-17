import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {

  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

  }, []);

  function handleStart() {

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }

  }

  return (

    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}

      <section className="text-center py-24 px-6">

        <h1 className="text-5xl font-bold text-indigo-600 mb-6">
          Study Companion
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
          Plan your exams intelligently. Automatically prioritize
          subjects and distribute daily study hours for maximum efficiency.
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Start Studying
          </button>

          {!token && (

            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Login / Sign Up
            </button>

          )}

        </div>

      </section>


      {/* Features Section */}

      <section className="max-w-6xl mx-auto px-6 pb-24">

        <h2 className="text-3xl font-bold text-center mb-12">
          Why Use Study Companion?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">Smart Planning</h3>
            <p className="text-gray-600">
              Automatically calculate subject priorities based on difficulty and chapters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">Daily Study Distribution</h3>
            <p className="text-gray-600">
              Evenly distribute your study hours to maximize productivity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Track subjects and analyze your preparation through dashboards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">AI Study Assistant</h3>
            <p className="text-gray-600">
              Ask questions and get AI explanations for difficult concepts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">AI Mock Tests</h3>
            <p className="text-gray-600">
              Generate chapter-wise mock tests and evaluate your preparation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold mb-2">Notes Management</h3>
            <p className="text-gray-600">
              Save important notes and organize them chapter-wise.
            </p>
          </div>

        </div>

      </section>

    </div>

  );

}
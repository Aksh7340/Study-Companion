import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {

  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  /* =========================
     Check Login Status
  ========================= */

  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

  }, []);


  /* =========================
     Start Button
  ========================= */

  function handleStart() {

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }

  }


  return (

    <div className="home">

      {/* =========================
         Hero Section
      ========================= */}

      <section className="hero">

        <h1 className="hero-title">
          Study Companion
        </h1>

        <p className="hero-subtitle">
          Plan your exams intelligently. Automatically
          prioritize subjects and distribute daily study
          hours for maximum efficiency.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={handleStart}
          >
            Start Studying
          </button>

          {!token && (

            <button
              className="secondary-btn"
              onClick={() => navigate("/auth")}
            >
              Login / Sign Up
            </button>

          )}

        </div>

      </section>


      {/* =========================
         Features Section
      ========================= */}

      <section className="features">

        <h2 className="features-title">
          Why Use Study Companion?
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>Smart Planning</h3>
            <p>
              Automatically calculate subject priorities
              based on difficulty and chapters.
            </p>
          </div>

          <div className="feature-card">
            <h3>Daily Study Distribution</h3>
            <p>
              Evenly distribute your study hours to
              maximize productivity.
            </p>
          </div>

          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>
              Track subjects and analyze your
              preparation through dashboards.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Study Assistant</h3>
            <p>
              Ask questions and get AI explanations
              for difficult concepts.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Mock Tests</h3>
            <p>
              Generate chapter-wise mock tests
              and evaluate your preparation.
            </p>
          </div>

          <div className="feature-card">
            <h3>Notes Management</h3>
            <p>
              Save important notes and organize
              them chapter-wise.
            </p>
          </div>

        </div>

      </section>

    </div>

  );

}
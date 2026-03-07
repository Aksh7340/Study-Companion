import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">

        <h1 className="hero-title">
          Study Companion
        </h1>

        <p className="hero-subtitle">
          Plan your exams intelligently.  
          Automatically prioritize subjects and distribute
          daily study hours for maximum efficiency.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/setup")}
          >
            Create Study Plan
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Open Dashboard
          </button>

        </div>

      </section>


      {/* Features Section */}

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
              Track subjects and analyze your preparation
              through dashboards.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
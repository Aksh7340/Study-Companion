import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  {
    icon: "🧠",
    title: "Smart Planning",
    desc: "Automatically calculate subject priorities based on difficulty and chapters.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: "⏱️",
    title: "Daily Distribution",
    desc: "Evenly distribute your study hours to maximise daily productivity.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Track subjects and analyse your preparation through clear dashboards.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🤖",
    title: "AI Study Assistant",
    desc: "Ask questions and get AI explanations for difficult concepts instantly.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: "📝",
    title: "AI Mock Tests",
    desc: "Generate chapter-wise mock tests and evaluate your exam readiness.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "🗒️",
    title: "Notes Management",
    desc: "Save important notes and organise them neatly chapter by chapter.",
    gradient: "from-violet-500 to-indigo-500",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  function handleStart() {
    navigate(token ? "/dashboard" : "/auth");
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-indigo-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-purple-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700
            text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse-soft" />
            AI-Powered Study Companion
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 mb-5 leading-tight animate-slide-up">
            Study Smarter,{" "}
            <span className="gradient-text">Not Harder</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Plan your exams intelligently. Auto-prioritise subjects, distribute study
            hours, track your progress, and ace every test with AI guidance.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={handleStart}
              className="btn-primary px-8 py-3 text-base"
            >
              {token ? "Go to Dashboard →" : "Get Started Free →"}
            </button>

            {!token && (
              <button
                onClick={() => navigate("/auth")}
                className="btn-ghost px-8 py-3 text-base"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Stats strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { value: "100%", label: "Free to use" },
              { value: "AI",   label: "Powered insights" },
              { value: "∞",    label: "Subjects & exams" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Everything you need to{" "}
            <span className="gradient-text">excel</span>
          </h2>
          <p className="text-slate-500 mt-3 text-base max-w-xl mx-auto">
            A complete toolkit built for serious students who want structured, efficient preparation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm card-hover border border-slate-100 animate-fade-in"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-2xl mb-4 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
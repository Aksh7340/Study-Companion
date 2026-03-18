import ExamList from "../Components/Exams/ExamList";
import WeakChapters from "../Components/Analytics/WeakChapters";
import WeakSubjects  from "../Components/Analytics/WeakSubjects";
import { getExamStatus } from "../Logic/studyPlanner";

function StatPill({ label, value, color }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${color} text-sm font-semibold`}>
      <span className="text-xl font-extrabold">{value}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  );
}

export default function Dashboard({ examData = [], deleteExam, subjects = [], loading, error }) {

  /* Derived counts for the top strip */
  const total     = examData.length;
  const completed = examData.filter(e => getExamStatus(e, subjects) === "Completed").length;
  const urgent    = examData.filter(e => getExamStatus(e, subjects) === "Urgent").length;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading your dashboard…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-fade-in">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-red-700 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── Empty ── */
  if (total === 0) {
    return (
      <div className="max-w-lg mx-auto mt-20 bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center animate-fade-in">
        <p className="text-5xl mb-4">📚</p>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Exams Yet</h3>
        <p className="text-slate-500 text-sm mb-6">
          Head over to <strong>Setup</strong> to add your first exam and start planning your study.
        </p>
        <a href="/setup" className="btn-primary">
          Go to Setup →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Track your exam preparation and identify weak areas.
          </p>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-2">
          <StatPill label="Total"     value={total}     color="bg-indigo-100 text-indigo-700" />
          <StatPill label="Completed" value={completed}  color="bg-emerald-100 text-emerald-700" />
          <StatPill label="Urgent"    value={urgent}     color="bg-red-100 text-red-700" />
        </div>
      </div>

      {/* ── Exams Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
            Your Exams
          </h2>
          <a href="/setup"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
            + Add Exam
          </a>
        </div>
        <ExamList examData={examData} deleteExam={deleteExam} subjects={subjects} />
      </section>

      {/* ── Analytics ── */}
      <section>
        <div className="flex items-center mb-5">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-purple-500 inline-block" />
            Study Insights
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 card-hover">
            <WeakSubjects subjects={subjects} examId={examData[0]?._id} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 card-hover">
            <WeakChapters subjects={subjects} />
          </div>
        </div>
      </section>

    </div>
  );
}

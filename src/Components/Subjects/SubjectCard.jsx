import { useNavigate } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";
import { getSubjectProgress } from "../../Logic/studyPlanner";

const difficultyBadge = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
};

export default function SubjectCard({ subject, weight, hours, examId, deleteSubject }) {

  const navigate = useNavigate();
  if (!subject) return null;

  const subjectId = subject._id;
  const progress  = getSubjectProgress(subject);
  const diffCfg   = difficultyBadge[subject.difficulty] ?? "bg-slate-100 text-slate-600";

  function handleClick() {
    if (!subjectId) return;
    navigate(`/dashboard/${examId}/${subjectId}`);
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (!subjectId) return;
    if (window.confirm(`Delete subject "${subject.name}"?`)) {
      deleteSubject(subjectId);
    }
  }

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
        cursor-pointer group overflow-hidden border border-slate-100 hover:-translate-y-1 animate-fade-in"
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-indigo-500 to-purple-500
        group-hover:w-1.5 transition-all duration-200" />

      <div className="pl-5 pr-5 pt-5 pb-4 flex flex-col gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
            {subject.name || "Unnamed Subject"}
          </h3>
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffCfg}`}>
            {subject.difficulty}
          </span>
        </div>

        {/* Info tiles */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Daily Time</p>
            <p className="font-bold text-slate-700">{hours ?? "—"}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Chapters</p>
            <p className="font-bold text-slate-700">{subject.chapters?.length || 0}</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={progress} label="Progress" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400 font-medium">{progress}% complete</span>
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-semibold
              hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
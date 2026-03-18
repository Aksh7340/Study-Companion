import { useNavigate } from "react-router-dom";
import {
  getExamProgress,
  getDaysLeftInfo,
  getExamStatus
} from "../../Logic/studyPlanner";
import ProgressBar from "../UI/ProgressBar";

const statusConfig = {
  "Completed":   { color: "bg-emerald-100 text-emerald-700",  accent: "#22c55e",  dot: "bg-emerald-500" },
  "Ready":       { color: "bg-cyan-100 text-cyan-700",        accent: "#06b6d4",  dot: "bg-cyan-500" },
  "In Progress": { color: "bg-blue-100 text-blue-700",        accent: "#6366f1",  dot: "bg-blue-500" },
  "Upcoming":    { color: "bg-amber-100 text-amber-700",      accent: "#f59e0b",  dot: "bg-amber-500" },
  "Urgent":      { color: "bg-red-100 text-red-700",          accent: "#ef4444",  dot: "bg-red-500" },
  "Incomplete":  { color: "bg-rose-100 text-rose-700",        accent: "#f43f5e",  dot: "bg-rose-500" },
};

export default function ExamCard({ exam, deleteExam, subjects }) {

  const navigate  = useNavigate();
  const progress  = getExamProgress(exam._id, subjects);
  const daysInfo  = getDaysLeftInfo(exam.date);
  const status    = getExamStatus(exam, subjects);

  const cfg = statusConfig[status] ?? statusConfig["In Progress"];

  function handleNavigate() { navigate(`/dashboard/${exam._id}`); }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete exam "${exam.examName}"?`)) deleteExam(exam._id);
  }

  return (
    <div
      onClick={handleNavigate}
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
        cursor-pointer group overflow-hidden border border-slate-100 hover:-translate-y-1 animate-fade-in"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 group-hover:w-1.5"
        style={{ background: cfg.accent }}
      />

      <div className="pl-5 pr-5 pt-5 pb-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
            {exam.examName}
          </h3>
          <span className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {status}
          </span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Date</p>
            <p className="font-semibold text-slate-700">
               {exam.date ? new Date(exam.date).toLocaleDateString("en-GB") : "—"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Days Left</p>
            <p className={`font-semibold ${daysInfo.color}`}>
              {daysInfo.text}
            </p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={progress} label="Exam Progress" />

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
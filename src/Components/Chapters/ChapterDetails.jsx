import { useParams, useNavigate } from "react-router-dom";

import MockResultChart        from "../Analytics/MockResultChart";
import MockHistory            from "../MockTest/MockHistory";
import NotesManager           from "../Notes/NotesManager";
import AssistantChat          from "../Assistant/AssistantChat";
import ProgressBar            from "../UI/ProgressBar";

import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";

const statusCfg = {
  "Completed":   { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "In Progress": { color: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  "Not Started": { color: "bg-slate-100 text-slate-600",     dot: "bg-slate-400" },
};

export default function ChapterDetails({ subjects, updateChapter }) {

  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  if (!subjects || subjects.length === 0) return (
    <div className="flex flex-col items-center py-32 text-slate-400">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading chapter…</p>
    </div>
  );

  const subject = subjects.find(s => String(s._id) === String(subjectId));
  if (!subject) return <p className="text-center text-slate-500 mt-10">Subject not found.</p>;

  const chapter = subject.chapters?.find(ch => String(ch._id) === String(chapterId));
  if (!chapter)  return <p className="text-center text-slate-500 mt-10">Chapter not found.</p>;

  const testsTaken = getChapterTestsTaken(chapter);
  const avgScore   = getChapterAverageScore(chapter);
  const bestScore  = getChapterBestScore(chapter);
  const progress   = getChapterProgress(chapter);
  const status     = getChapterStatus(chapter);
  const cfg        = statusCfg[status] ?? statusCfg["Not Started"];

  const stats = [
    { label: "Tests Taken",   value: testsTaken,                    bg: "bg-indigo-50",  text: "text-indigo-700",  icon: "📝" },
    { label: "Best Score",    value: bestScore ?? "—",              bg: "bg-emerald-50", text: "text-emerald-700", icon: "🏆" },
    { label: "Avg Score",     value: avgScore ? avgScore.toFixed(1) : "0.0", bg: "bg-blue-50", text: "text-blue-700", icon: "📊" },
    { label: "Progress",      value: `${progress}%`,                bg: "bg-amber-50",   text: "text-amber-700",   icon: "⚡" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Back */}
      <button onClick={() => navigate(`/dashboard/${examId}/${subjectId}`)} className="btn-ghost text-sm">
        ← Back to Subject
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1.5 gradient-primary w-full" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-extrabold text-slate-800">{chapter.name}</h1>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {status}
                </span>
              </div>
              <p className="text-slate-500 text-sm">📚 Part of <strong>{subject.name}</strong></p>
              <div className="mt-3 max-w-xs">
                <ProgressBar progress={progress} label="Chapter Progress" />
              </div>
            </div>

            {/* Take Test CTA */}
            <button
              onClick={() => navigate(`/dashboard/${examId}/${subjectId}/${chapterId}/mock`)}
              className="btn-primary self-start sm:self-center whitespace-nowrap"
            >
              📝 Take Mock Test
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-white shadow-sm`}>
            <p className="text-xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Performance chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
          Performance History
        </h2>
        <MockResultChart chapter={chapter} />
      </div>

      {/* Mock History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-purple-500 inline-block" />
            Test History
          </h2>
          <button
            onClick={() => navigate(`/dashboard/${examId}/${subjectId}/${chapterId}/mock`)}
            className="btn-primary text-xs px-4 py-2"
          >
            + New Test
          </button>
        </div>
        <MockHistory chapter={chapter} />
      </div>

      {/* Notes + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block" />
            Notes
          </h2>
          <NotesManager chapter={chapter} subjectId={subjectId} chapterId={chapterId} updateChapter={updateChapter} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
            AI Study Assistant
          </h2>
          <AssistantChat chapter={chapter} subjectId={subjectId} chapterId={chapterId} subjectName={subject.name} updateChapter={updateChapter} />
        </div>
      </div>

    </div>
  );
}
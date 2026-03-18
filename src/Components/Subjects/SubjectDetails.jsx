import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ChapterList           from "../Chapters/ChapterList";
import ChapterPerformanceBar from "../Analytics/ChapterPerformanceBar";
import ProgressBar           from "../UI/ProgressBar";

import {
  calculateSubjectWeight,
  distributeDailyHours,
  getSubjectProgress
} from "../../Logic/studyPlanner";

const difficultyBadge = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
};

export default function SubjectDetails({ subjects, examData, updateSubject }) {

  const { examId, subjectId } = useParams();
  const navigate = useNavigate();

  const exam    = examData.find(e => String(e._id) === String(examId));
  const subject = subjects.find(s => String(s._id) === String(subjectId));

  const [editing,    setEditing]    = useState(false);
  const [name,       setName]       = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    if (subject) { setName(subject.name || ""); setDifficulty(subject.difficulty || "Easy"); }
  }, [subject]);

  if (!exam || !subject) return (
    <div className="flex flex-col items-center justify-center py-32">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-slate-500 font-medium">Subject not found.</p>
      <button onClick={() => navigate(`/dashboard/${examId}`)} className="btn-ghost mt-4">← Back</button>
    </div>
  );

  const weight   = calculateSubjectWeight(subject);
  const hours    = distributeDailyHours(subject, subjects, exam);
  const progress = getSubjectProgress(subject);
  const diffCfg  = difficultyBadge[subject.difficulty] ?? "bg-slate-100 text-slate-600";

  async function handleSave() {
    try {
      setSaving(true);
      await updateSubject({ ...subject, name: name.trim(), difficulty });
      setEditing(false);
    } catch (err) { console.error("Subject update failed", err); }
    finally { setSaving(false); }
  }

  function handleCancel() {
    setName(subject.name); setDifficulty(subject.difficulty); setEditing(false);
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Back */}
      <button onClick={() => navigate(`/dashboard/${examId}`)} className="btn-ghost text-sm">
        ← Back to Exam
      </button>

      {/* Hero card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1.5 gradient-primary w-full" />
        <div className="p-6">
          {!editing ? (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-extrabold text-slate-800">{subject.name}</h1>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${diffCfg}`}>
                    {subject.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                  <span>📖 {subject.chapters?.length || 0} Chapters</span>
                  <span>⏱️ {hours} / day</span>
                  <span>⚖️ Weight: {weight}</span>
                </div>
                <div className="max-w-sm">
                  <ProgressBar progress={progress} label="Subject Progress" />
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="btn-primary self-start">
                ✏️ Edit Subject
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-md">
              <h2 className="text-lg font-bold text-slate-700 mb-3">Edit Subject</h2>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Subject Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={handleCancel} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div>
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
          Chapters
        </h2>
        <ChapterList subject={subject} updateSubject={updateSubject} />
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-purple-500 inline-block" />
          Chapter Performance
        </h2>
        <ChapterPerformanceBar subject={subject} />
      </div>

    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SubjectList    from "../Subjects/SubjectList";
import SubjectPieChart from "../Analytics/SubjectPieChart";
import ProgressBar    from "../UI/ProgressBar";

import { getExamProgress, getExamStatus, remainingDays } from "../../Logic/studyPlanner";

const statusConfig = {
  "Completed":   { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Ready":       { color: "bg-cyan-100 text-cyan-700",       dot: "bg-cyan-500" },
  "In Progress": { color: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  "Upcoming":    { color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  "Urgent":      { color: "bg-red-100 text-red-700",         dot: "bg-red-500" },
  "Incomplete":  { color: "bg-rose-100 text-rose-700",       dot: "bg-rose-500" },
};

export default function ExamDetails({ examData, subjects, updateExam, deleteSubject }) {

  const { examId } = useParams();
  const navigate   = useNavigate();

  const exam = examData.find(e => String(e._id) === String(examId));

  const examSubjects = subjects.filter(
    s => String(s.examId) === String(examId)
  );

  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState("");
  const [date, setDate]       = useState("");
  const [hours, setHours]     = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (exam) {
      setName(exam.examName);
      setDate(exam.date?.slice(0, 10));
      setHours(exam.studyHours);
    }
  }, [exam]);

  if (!exam) return (
    <div className="flex flex-col items-center justify-center py-32">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-slate-500 font-medium">Exam not found.</p>
      <button onClick={() => navigate("/dashboard")} className="btn-ghost mt-4">← Back</button>
    </div>
  );

  const progress      = getExamProgress(exam._id, subjects);
  const status        = getExamStatus(exam, subjects);
  const days          = remainingDays(exam.date);
  const totalSubjects = examSubjects.length;
  const totalChapters = examSubjects.reduce((sum, s) => sum + (s.chapters?.length || 0), 0);
  const cfg           = statusConfig[status] ?? statusConfig["In Progress"];

  async function handleSave() {
    try {
      setSaving(true);
      const updatedExam = { ...exam, examName: name, date, studyHours: Number(hours) };
      await updateExam(updatedExam);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update exam", err);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName(exam.examName);
    setDate(exam.date?.slice(0, 10));
    setHours(exam.studyHours);
    setEditing(false);
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="btn-ghost text-sm"
      >
        ← Back to Dashboard
      </button>

      {/* Hero card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Gradient top bar */}
        <div className="h-1.5 w-full gradient-primary" />

        <div className="p-6">
          {!editing ? (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-extrabold text-slate-800">{exam.examName}</h1>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>📅 {exam.date ? new Date(exam.date).toLocaleDateString("en-GB") : "No date"}</span>
                  <span>⏰ {exam.studyHours} hrs/day</span>
                  <span className={days <= 7 ? "text-red-600 font-semibold" : ""}>
                    🗓️ {days > 0 ? `${days} days left` : days === 0 ? "Exam day!" : "Overdue"}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-4 max-w-sm">
                  <ProgressBar progress={progress} label="Overall Progress" />
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="btn-primary self-start"
              >
                ✏️ Edit Exam
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-md">
              <h2 className="text-lg font-bold text-slate-700 mb-3">Edit Exam</h2>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Exam Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Study Hours / Day</label>
                <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="input-field" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button onClick={handleCancel} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Subjects",         value: totalSubjects, icon: "📚", bg: "bg-indigo-50",  text: "text-indigo-700" },
          { label: "Total Chapters",   value: totalChapters, icon: "📖", bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "Study Hrs / Day",  value: exam.studyHours, icon: "⏱️", bg: "bg-emerald-50", text: "text-emerald-700" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center border border-white shadow-sm`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subject chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
          Subject Distribution
        </h2>
        <SubjectPieChart subjects={subjects} examId={exam._id} />
      </div>

      {/* Subjects list */}
      <div>
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-purple-500 inline-block" />
          Subjects
        </h2>
        <SubjectList subjects={subjects} exam={exam} />
      </div>

    </div>
  );
}
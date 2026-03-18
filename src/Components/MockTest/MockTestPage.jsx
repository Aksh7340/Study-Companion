import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../Api/api";
import QuestionCard from "./QuestionCard";
import MockResult   from "./MockResult";

/**
 * =========================================
 * NEW FEATURE: MOCK TEST PAGE
 * =========================================
 * This component handles the full lifecycle of a mock test:
 * 1. Generating questions via the AI backend route (`/ai/generate-mock`)
 * 2. Managing the user's selected answers in real-time
 * 3. Calculating the final score upon submission
 * 4. Saving the results securely to the database
 */
export default function MockTestPage({ subjects, updateChapter }) {

  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  // State for the test lifecycle
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [saving,    setSaving]    = useState(false);

  const subject = subjects.find(s => String(s._id) === String(subjectId));
  const chapter = subject?.chapters?.find(c => String(c._id) === String(chapterId));

  useEffect(() => {
    async function generateMock() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.post(
          "/ai/generate-mock",
          { chapterName: chapter?.name, difficulty: subject?.difficulty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Mock generation failed", err);
        setError("Failed to generate questions. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (chapter && subject) generateMock();
  }, [chapter, subject]);

  function selectAnswer(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  }

  const totalQuestions = questions.length;
  const attempted      = Object.keys(answers).length;
  const unattempted    = totalQuestions - attempted;
  const pct            = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 100) : 0;

  async function submitTest() {
    if (unattempted > 0) {
      const ok = window.confirm(`${unattempted} question${unattempted > 1 ? "s" : ""} unattempted. Submit anyway?`);
      if (!ok) return;
    }

    let correct = 0, wrong = 0;
    questions.forEach(q => {
      const selected = answers[q.id];
      if (!selected) return;
      if (selected === q.correct) correct++; else wrong++;
    });

    const newResult = { correct, wrong, unattempted, score: correct, total: totalQuestions };
    setResult(newResult);
    setSubmitted(true);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res   = await api.post(
        `/subjects/${subjectId}/chapters/${chapterId}/mocktests`,
        { score: correct, total: totalQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedChapter = { ...chapter, mockTests: [...(chapter.mockTests || []), res.data] };
      updateChapter(subjectId, chapterId, updatedChapter);
    } catch (err) {
      console.error("Failed to save mock test", err);
    } finally {
      setSaving(false);
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-sm w-full">
        <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-1">Generating Mock Test</h2>
        <p className="text-sm text-slate-500">AI is crafting questions for <strong>{chapter?.name}</strong>…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl border border-red-100 p-10 text-center max-w-sm w-full">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-ghost">← Go Back</button>
      </div>
    </div>
  );

  /* ── Result ── */
  if (submitted) return <MockResult result={result} examId={examId} subjectId={subjectId} chapterId={chapterId} saving={saving} />;

  /* ── Test UI ── */
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm">← Back</button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1.5 gradient-primary w-full" />
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 mb-0.5">📝 Mock Test</h2>
              <p className="text-slate-500 text-sm">
                <strong>{chapter?.name}</strong> · {subject?.difficulty} difficulty
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center bg-indigo-50 rounded-xl px-4 py-2">
                <p className="text-xs text-indigo-400 font-semibold uppercase">Done</p>
                <p className="text-xl font-extrabold text-indigo-700">{attempted}/{totalQuestions}</p>
              </div>
              <div className="text-center bg-amber-50 rounded-xl px-4 py-2">
                <p className="text-xs text-amber-400 font-semibold uppercase">Left</p>
                <p className="text-xl font-extrabold text-amber-700">{unattempted}</p>
              </div>
            </div>
          </div>

          {/* Progress strip */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Question progress</span>
              <span className="font-semibold text-indigo-600">{pct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* No questions guard */}
      {questions.length === 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 p-8 text-center">
          <p className="text-3xl mb-2">🤔</p>
          <p className="text-slate-600 font-semibold">No questions were generated.</p>
          <p className="text-slate-400 text-sm mt-1">Please go back and try again.</p>
          <button onClick={() => navigate(-1)} className="btn-ghost mt-4">← Go Back</button>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx + 1}
            selected={answers[q.id]}
            onSelect={selectAnswer}
          />
        ))}
      </div>

      {/* Submit */}
      {questions.length > 0 && (
        <div className="flex justify-center pb-6">
          <button
            onClick={submitTest}
            className="btn-primary px-10 py-3 text-base"
          >
            Submit Test →
          </button>
        </div>
      )}
    </div>
  );
}
/**
 * =========================================
 * NEW FEATURE: MOCK RESULT UI
 * =========================================
 * This component handles the final display of a mock test's outcome.
 * 
 * Key Features:
 * 1. Calculates a percentage `pct` based on correct answers vs. total questions.
 * 2. Uses a tiered grading system (Excellent, Great Job, Good Try, Keep Going)
 *    to dynamically assign an emoji, text label, and color scheme.
 * 3. Renders a clean 3-part statistics grid showing Total, Correct, and Wrong.
 * 4. Shows an animated gradient progress bar representing the final score visually.
 */
import { useNavigate } from "react-router-dom";

export default function MockResult({ result, examId, subjectId, chapterId, saving }) {

  const navigate = useNavigate();
  const pct      = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  // Tiered grading logic based on the percentage score
  const grade =
    pct >= 90 ? { label: "Excellent!", emoji: "🏆", color: "text-emerald-600" } :
    pct >= 75 ? { label: "Great Job!",  emoji: "🎉", color: "text-blue-600" } :
    pct >= 50 ? { label: "Good Try!",   emoji: "👍", color: "text-amber-600" } :
                { label: "Keep Going!", emoji: "💪", color: "text-red-500"   };

  /* Fill colour based on score */
  const fillClass =
    pct >= 75 ? "from-emerald-400 to-emerald-500" :
    pct >= 50 ? "from-amber-400 to-orange-500" :
                "from-red-400 to-rose-500";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 w-full max-w-md overflow-hidden">

        {/* Gradient top */}
        <div className="h-1.5 gradient-primary" />

        <div className="p-8 space-y-6">

          {/* Title */}
          <div className="text-center">
            <p className="text-4xl mb-2">{grade.emoji}</p>
            <h2 className="text-2xl font-extrabold text-slate-800">Test Complete</h2>
            <p className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</p>
          </div>

          {/* Big score */}
          <div className="text-center">
            <p className="text-5xl font-extrabold text-slate-800">
              {result.score}
              <span className="text-2xl text-slate-400 font-medium">/{result.total}</span>
            </p>
            <p className="text-slate-500 text-sm mt-1">questions correct</p>

            {/* Score bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${fillClass} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{pct}% accuracy</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{result.correct}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Correct</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-red-500">{result.wrong}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Wrong</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-slate-500">{result.unattempted}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Skipped</p>
            </div>
          </div>

          {/* Saving indicator */}
          {saving && (
            <p className="text-xs text-center text-indigo-400 animate-pulse">💾 Saving result…</p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/dashboard/${examId}/${subjectId}/${chapterId}`)}
              className="btn-primary w-full py-3"
            >
              ← Back to Chapter
            </button>
            <button
              onClick={() => navigate(`/dashboard/${examId}/${subjectId}/${chapterId}/mock`)}
              className="btn-ghost w-full py-3 text-sm"
            >
              🔄 Retry Test
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
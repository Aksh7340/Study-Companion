/**
 * =========================================
 * NEW FEATURE: CUSTOM QUESTION CARD UI
 * =========================================
 * Replaces the default, ugly HTML radio buttons with a sleek, clickable card.
 * 
 * Key Features:
 * 1. Generates A, B, C, D letter badges dynamically based on the option index.
 * 2. Entire row (`<label>`) is clickable, not just the radio button.
 * 3. Hides the actual native `<input type="radio">` using `sr-only` (screen reader only).
 * 4. Applies selected styles (indigo borders, checkmarks) dynamically when 
 *    `selected === opt`.
 */
export default function QuestionCard({ question, index, selected, onSelect }) {

  if (!question) return null;

  const groupName = `question-${question.id || Math.random()}`;
  const options   = question.options || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-in-up">
      {/* Question header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700
          text-xs font-extrabold flex items-center justify-center">
          {index}
        </span>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
          {question.question || "Invalid Question"}
        </p>
      </div>

      {/* Options */}
      {options.length === 0 ? (
        <p className="text-xs text-slate-400 px-5 pb-5">No options available.</p>
      ) : (
        <div className="px-5 pb-5 space-y-2.5">
          {options.map((opt, idx) => {
            const isSelected = selected === opt;
            const letter     = String.fromCharCode(65 + idx); // A, B, C, D
            return (
              <label
                key={`${question.id}-${idx}`}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-150
                  ${isSelected
                    ? "border-indigo-400 bg-indigo-50 shadow-sm shadow-indigo-100"
                    : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40"}`}
              >
                {/* Letter circle */}
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors
                  ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {letter}
                </span>

                <input
                  type="radio"
                  name={groupName}
                  value={opt}
                  checked={isSelected}
                  onChange={() => onSelect(question.id, opt)}
                  className="sr-only"
                />

                <span className={`text-sm transition-colors ${isSelected ? "text-indigo-800 font-medium" : "text-slate-700"}`}>
                  {opt}
                </span>

                {isSelected && (
                  <span className="ml-auto text-indigo-500">✓</span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
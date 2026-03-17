export default function QuestionCard({
  question,
  selected,
  onSelect
}) {

  if (!question) return null;

  const groupName = `question-${question.id || Math.random()}`;
  const options = question.options || [];

  return (

    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

      {/* Question */}

      <p className="font-semibold text-gray-800">
        {question.question || "Invalid Question"}
      </p>


      {/* Options */}

      {options.length === 0 && (
        <p className="text-sm text-gray-500">
          No options available
        </p>
      )}


      <div className="space-y-2">

        {options.map((opt, index) => {

          const isSelected = selected === opt;

          return (

            <label
              key={`${question.id}-${index}`}
              className={`flex items-center gap-3 border rounded-lg px-4 py-2 cursor-pointer transition
                ${isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:bg-gray-50"
                }`}
            >

              <input
                type="radio"
                name={groupName}
                value={opt}
                checked={isSelected}
                onChange={() => onSelect(question.id, opt)}
                className="accent-indigo-600"
              />

              <span className="text-gray-700">
                {opt}
              </span>

            </label>

          );

        })}

      </div>

    </div>

  );

}
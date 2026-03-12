export default function QuestionCard({
  question,
  selected,
  onSelect
}) {

  if (!question) return null;

  const groupName = `question-${question.id || Math.random()}`;

  const options = question.options || [];

  return (

    <div className="card">

      <p>
        <strong>{question.question || "Invalid Question"}</strong>
      </p>

      {options.length === 0 && (
        <p>No options available</p>
      )}

      {options.map((opt, index) => (

        <div key={`${question.id}-${index}`}>

          <label>

            <input
              type="radio"
              name={groupName}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(question.id, opt)}
            />

            {opt}

          </label>

        </div>

      ))}

    </div>

  );

}
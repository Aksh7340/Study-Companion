export default function QuestionCard({
  question,
  selected,
  onSelect
}) {

  return (
    <div className="card">

      <p><strong>{question.question}</strong></p>

      {question.options.map(opt => (
        <div key={opt}>

          <label>

            <input
              type="radio"
              name={question.id}
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
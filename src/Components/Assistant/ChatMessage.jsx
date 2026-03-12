export default function ChatMessage({ chat }) {

  if (!chat) return null;

  const question = chat.question || "No question";
  const answer = chat.answer || "No answer generated";

  const date = chat.createdAt
    ? new Date(chat.createdAt).toLocaleString("en-GB")
    : "";

  return (

    <div className="card">

      <p>
        <strong>You:</strong> {question}
      </p>

      <p>
        <strong>AI:</strong> {answer}
      </p>

      {date && <small>{date}</small>}

    </div>

  );

}
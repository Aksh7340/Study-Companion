export default function ChatMessage({ chat }) {

  if (!chat) return null;

  const question = chat.question || "No question";
  const answer = chat.answer || "No answer generated";

  const date = chat.createdAt
    ? new Date(chat.createdAt).toLocaleString("en-GB")
    : "";

  return (

    <div className="space-y-3">

      {/* User Question */}

      <div className="flex justify-end">
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg max-w-[75%] shadow-sm">
          <p className="text-sm">
            {question}
          </p>
        </div>
      </div>


      {/* AI Answer */}

      <div className="flex justify-start">
        <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-[75%] shadow-sm">
          <p className="text-sm text-gray-800">
            {answer}
          </p>
        </div>
      </div>


      {/* Timestamp */}

      {date && (
        <p className="text-xs text-gray-400 text-center">
          {date}
        </p>
      )}

    </div>

  );

}
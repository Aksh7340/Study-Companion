import { useState } from "react";

export default function ChatInput({ askAI }) {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleAsk() {

    const trimmed = question.trim();

    if (!trimmed || loading) return;

    setLoading(true);

    try {

      await askAI(trimmed);

      setQuestion("");

    } catch (error) {

      console.error("Failed to ask AI:", error);

    } finally {

      setLoading(false);

    }

  }


  function handleKeyDown(e) {

    if (e.key === "Enter") {

      e.preventDefault();

      handleAsk();

    }

  }


  return (

    <div className="flex gap-3 items-center">

      <input
        placeholder="Ask something about this chapter..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
      />

      <button
        onClick={handleAsk}
        disabled={!question.trim() || loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >

        {loading ? "Thinking..." : "Ask AI"}

      </button>

    </div>

  );

}
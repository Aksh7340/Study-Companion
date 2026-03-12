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

    <div>

      <input
        placeholder="Ask something about this chapter..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        className="button"
        onClick={handleAsk}
        disabled={!question.trim() || loading}
      >

        {loading ? "Thinking..." : "Ask AI"}

      </button>

    </div>

  );

}
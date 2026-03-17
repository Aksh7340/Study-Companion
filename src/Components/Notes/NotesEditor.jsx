import { useState } from "react";

export default function NoteEditor({ addNote }) {

  const [text, setText] = useState("");

  /* =========================
     Add Note
  ========================= */

  function handleAdd() {

    const trimmed = text.trim();

    if (!trimmed) return;

    addNote(trimmed);

    setText("");

  }


  /* =========================
     Keyboard Shortcut
     Ctrl + Enter OR Enter
  ========================= */

  function handleKeyDown(e) {

    if ((e.ctrlKey && e.key === "Enter") || e.key === "Enter") {

      e.preventDefault();

      const trimmed = text.trim();

      if (!trimmed) return;

      handleAdd();

    }

  }


  return (

    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">

      <textarea
        placeholder="Write chapter notes..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <div className="flex justify-end">

        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Add Note
        </button>

      </div>

    </div>

  );

}
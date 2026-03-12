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

    <div>

      <textarea
        placeholder="Write chapter notes..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
      />

      <button
        className="button"
        onClick={handleAdd}
        disabled={!text.trim()}
      >
        Add Note
      </button>

    </div>

  );

}
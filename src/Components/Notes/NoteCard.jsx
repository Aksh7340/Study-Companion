export default function NoteCard({
  note,
  deleteNote
}) {

  if (!note) return null;

  const content = note.content || "Empty note";

  const date = note.createdAt
    ? new Date(note.createdAt).toLocaleString("en-GB")
    : "No date";


  function handleDelete() {

    if (!note._id) return;

    const confirmDelete = window.confirm(
      "Delete this note?"
    );

    if (confirmDelete) {
      deleteNote(note._id);
    }

  }


  return (

    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">

      {/* Note Content */}

      <p className="text-gray-800 text-sm leading-relaxed">
        {content}
      </p>


      {/* Footer */}

      <div className="flex justify-between items-center">

        <small className="text-gray-400 text-xs">
          {date}
        </small>

        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>

      </div>

    </div>

  );

}
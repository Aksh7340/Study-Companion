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

    <div className="card">

      <p>{content}</p>

      <small>{date}</small>

      <button
        className="button"
        onClick={handleDelete}
      >
        Delete
      </button>

    </div>

  );

}
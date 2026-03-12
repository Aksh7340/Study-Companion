import NoteCard from "./NoteCard";

export default function NoteList({
  notes = [],
  deleteNote
}) {

  if (!Array.isArray(notes) || notes.length === 0) {
    return <p>No notes yet</p>;
  }

  return (

    <div>

      {notes.map((note) => {

        if (!note) return null;

        return (

          <NoteCard
            key={note._id}
            note={note}
            deleteNote={deleteNote}
          />

        );

      })}

    </div>

  );

}
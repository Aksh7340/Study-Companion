import NoteCard from "./NoteCard";

export default function NoteList({
  notes = [],
  deleteNote
}) {

  if (!Array.isArray(notes) || notes.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        No notes yet
      </p>
    );
  }

  return (

    <div className="grid md:grid-cols-2 gap-4">

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
import { useEffect } from "react";
import NoteEditor from "./NotesEditor";
import NoteList from "./NoteList";
import api from "../../Api/api";

export default function NotesManager({
  chapter,
  subjectId,
  chapterId,
  updateChapter
}) {

  /* =========================
     Load Notes
  ========================= */

  useEffect(() => {

    async function loadNotes() {

      try {

        const res = await api.get(
          `/subjects/${subjectId}/chapters/${chapterId}/notes`
        );

        const updatedChapter = {
          ...chapter,
          notes: res.data || []
        };

        updateChapter(subjectId, chapterId, updatedChapter);

      } catch (error) {

        console.error("Failed to load notes", error);

      }

    }

    if (subjectId && chapterId) {
      loadNotes();
    }

  }, [subjectId, chapterId]);


  /* =========================
     Add Note
  ========================= */

  async function addNote(text) {

    try {

      const res = await api.post(
        `/subjects/${subjectId}/chapters/${chapterId}/notes`,
        { content: text }
      );

      const newNote = res.data;

      const updatedChapter = {
        ...chapter,
        notes: [...(chapter.notes || []), newNote]
      };

      updateChapter(subjectId, chapterId, updatedChapter);

    } catch (error) {

      console.error("Error adding note", error);

    }

  }


  /* =========================
     Delete Note
  ========================= */

  async function deleteNote(noteId) {

    try {

      await api.delete(
        `/subjects/${subjectId}/chapters/${chapterId}/notes/${noteId}`
      );

      const updatedNotes =
        (chapter.notes || []).filter(n => n._id !== noteId);

      const updatedChapter = {
        ...chapter,
        notes: updatedNotes
      };

      updateChapter(subjectId, chapterId, updatedChapter);

    } catch (error) {

      console.error("Error deleting note", error);

    }

  }


  return (

    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

      {/* Header */}

      <h3 className="text-lg font-semibold">
        Notes
      </h3>


      {/* Editor */}

      <NoteEditor addNote={addNote} />


      {/* Notes List */}

      <NoteList
        notes={chapter.notes || []}
        deleteNote={deleteNote}
      />

    </div>

  );

}
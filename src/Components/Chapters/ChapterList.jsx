import { useState } from "react";
import ChapterCard from "./ChapterCard";
import api from "../../Api/api";

export default function ChapterList({ subject, updateSubject }) {

  const [newChapterName, setNewChapterName] = useState("");

  const chapters = subject.chapters || [];


  /* =========================
     Add Chapter
  ========================= */

  async function addChapter() {

    const name = newChapterName.trim();
    if (!name) return;

    try {

      const res = await api.post(
        `/subjects/${subject._id}/chapters`,
        { name }
      );

      const newChapter = res.data;

      updateSubject({
        ...subject,
        chapters: [...chapters, newChapter]
      });

      setNewChapterName("");

    } catch (error) {

      console.error("Error adding chapter:", error);

    }

  }


  /* =========================
     Delete Chapter
  ========================= */

  async function deleteChapter(chapterId) {

    try {

      await api.delete(
        `/subjects/${subject._id}/chapters/${chapterId}`
      );

      const updatedChapters =
        chapters.filter(ch => ch._id !== chapterId);

      updateSubject({
        ...subject,
        chapters: updatedChapters
      });

    } catch (error) {

      console.error("Error deleting chapter:", error);

    }

  }


  return (

    <div>

      <h3>Chapters</h3>

      <div style={{ marginBottom: "15px" }}>

        <input
          placeholder="New Chapter Name"
          value={newChapterName}
          onChange={(e) =>
            setNewChapterName(e.target.value)
          }
        />

        <button
          className="button"
          onClick={addChapter}
          disabled={!newChapterName.trim()}
        >
          Add Chapter
        </button>

      </div>

      {chapters.length === 0 && (
        <p>No chapters added yet</p>
      )}

      <div className="subject-list">

        {chapters.map(chapter => (

          <ChapterCard
            key={chapter._id}
            chapter={chapter}
            deleteChapter={deleteChapter}
          />

        ))}

      </div>

    </div>

  );

}
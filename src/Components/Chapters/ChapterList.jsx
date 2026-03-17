import { useState } from "react";
import ChapterCard from "./ChapterCard";
import api from "../../Api/api";

export default function ChapterList({ subject, updateSubject }) {

  const [newChapterName, setNewChapterName] = useState("");

  const chapters = subject.chapters || [];


  async function addChapter() {

    const name = newChapterName.trim();

    if (!name) return;

    const exists = chapters.some(
      ch => ch.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("This chapter already exists in the subject.");
      return;
    }

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

    <div className="space-y-6">

  



      {/* Add Chapter */}

      <div className="flex gap-3">

        <input
          placeholder="New Chapter Name"
          value={newChapterName}
          onChange={(e) =>
            setNewChapterName(e.target.value)
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          onClick={addChapter}
          disabled={!newChapterName.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Add
        </button>

      </div>


      {/* Empty State */}

      {chapters.length === 0 && (
        <p className="text-gray-500 text-sm">
          No chapters added yet
        </p>
      )}


      {/* Chapter Grid */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

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
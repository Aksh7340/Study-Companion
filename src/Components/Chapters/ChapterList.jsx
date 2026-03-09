import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChapterCard from "./ChapterCard";

export default function ChapterList({ subject, updateSubject }) {

  const [newChapterName, setNewChapterName] = useState("");

  const chapters = subject.chapters || [];

  function addChapter() {

    const name = newChapterName.trim();

    if (!name) return;

    const newChapter = {
      id: uuidv4(),
      name,
     
      mockTests: []
    };

    const updatedChapters = [...chapters, newChapter];

    updateSubject({
      ...subject,
      chapters: updatedChapters
    });

    setNewChapterName("");
  }

  function deleteChapter(chapterId) {

    const updatedChapters = chapters.filter(
      ch => ch.id !== chapterId
    );

    updateSubject({
      ...subject,
      chapters: updatedChapters
    });
  }

 



  return (
    <div>

      <h3>Chapters</h3>

      {/* Add Chapter */}
      <div style={{ marginBottom: "15px" }}>

        <input
          placeholder="New Chapter Name"
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
        />

        <button
          className="button"
          onClick={addChapter}
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
            key={chapter.id}
            chapter={chapter}
            deleteChapter={deleteChapter}
          
         
          />
        ))}

      </div>

    </div>
  );
}
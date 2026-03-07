import ChapterCard from "./ChapterCard";

export default function ChapterList({ subject, updateSubject }) {

  const chapters = subject.chapters;

  function toggleCompletion(chapterId) {

    const updatedChapters = chapters.map(ch =>
      ch.id === chapterId
        ? { ...ch, completed: !ch.completed }
        : ch
    );

    updateSubject({
      ...subject,
      chapters: updatedChapters
    });
  }

  if (!chapters || chapters.length === 0) {
    return <p>No chapters added yet</p>;
  }

  return (
    <div className="subject-list">

      {chapters.map(chapter => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          toggleCompletion={toggleCompletion}
        />
      ))}

    </div>
  );
}
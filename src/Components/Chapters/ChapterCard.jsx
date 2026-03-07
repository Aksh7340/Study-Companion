export default function ChapterCard({ chapter, toggleCompletion }) {

  return (
    <div className="card">

      <h3>{chapter.name}</h3>

      <p>
        Status: {chapter.completed ? "Completed" : "Not Completed"}
      </p>

      <button
        className="button"
        onClick={() => toggleCompletion(chapter.id)}
      >
        {chapter.completed ? "Mark Incomplete" : "Mark Completed"}
      </button>

    </div>
  );
}
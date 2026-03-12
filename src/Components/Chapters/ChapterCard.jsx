import { useNavigate, useParams } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";

import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";

export default function ChapterCard({ chapter, deleteChapter }) {

  const navigate = useNavigate();
  const { examId, subjectId } = useParams();

  if (!chapter) return null;

  const testsTaken = getChapterTestsTaken(chapter);
  const avgScore = getChapterAverageScore(chapter);
  const bestScore = getChapterBestScore(chapter);
  const progress = getChapterProgress(chapter);
  const status = getChapterStatus(chapter);

  function openChapter() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapter._id}`);
  }

  function handleDelete(e) {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Delete chapter "${chapter.name}"?`
    );

    if (confirmDelete) {
      deleteChapter(chapter._id);
    }
  }

  return (
    <div
      className="card"
      onClick={openChapter}
      style={{ cursor: "pointer" }}
    >

      <h3>{chapter.name}</h3>

      <p>Status: {status}</p>

      <p>Tests Taken: {testsTaken}</p>

      <p>Best Score: {bestScore ?? "-"}</p>

      <p>
        Average Score: {avgScore ? avgScore.toFixed(1) : "0.0"}
      </p>

      <ProgressBar
        progress={progress}
        label="Chapter Progress"
      />

      <button
        className="button"
        onClick={handleDelete}
      >
        Delete
      </button>

    </div>
  );
}
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

  /* Status color */

  let statusColor = "bg-blue-500";

  if (status === "Completed") statusColor = "bg-green-500";
  if (status === "Not Started") statusColor = "bg-gray-400";
  if (status === "Weak") statusColor = "bg-red-500";
  if (status === "Average") statusColor = "bg-yellow-500";


  return (

    <div
      onClick={openChapter}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col gap-4"
    >

      {/* Header */}

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold text-gray-800">
          {chapter.name}
        </h3>

        <span
          className={`text-xs text-white px-3 py-1 rounded-full ${statusColor}`}
        >
          {status}
        </span>

      </div>


      {/* Metrics */}

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

        <div>
          <p className="text-gray-500">Tests Taken</p>
          <p className="font-semibold">{testsTaken}</p>
        </div>

        <div>
          <p className="text-gray-500">Best Score</p>
          <p className="font-semibold">{bestScore ?? "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Average</p>
          <p className="font-semibold">
            {avgScore ? avgScore.toFixed(1) : "0.0"}
          </p>
        </div>

      </div>


      {/* Progress */}

      <ProgressBar
        progress={progress}
        label="Chapter Progress"
      />


      {/* Footer */}

      <div className="flex justify-end">

        <button
          onClick={handleDelete}
          className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>

      </div>

    </div>

  );

}
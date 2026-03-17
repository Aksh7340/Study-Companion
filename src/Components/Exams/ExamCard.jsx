import { useNavigate } from "react-router-dom";
import {
  getExamProgress,
  remainingDays,
  getExamStatus
} from "../../Logic/studyPlanner";

import ProgressBar from "../UI/ProgressBar";

export default function ExamCard({
  exam,
  deleteExam,
  subjects
}) {

  const navigate = useNavigate();

  const progress = getExamProgress(exam._id, subjects);
  const days = exam.date ? remainingDays(exam.date) : null;

  const status = getExamStatus(exam, subjects);

  function handleNavigate() {
    navigate(`/dashboard/${exam._id}`);
  }

  function handleDelete(e) {

    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Delete exam "${exam.examName}"?`
    );

    if (confirmDelete) {
      deleteExam(exam._id);
    }

  }

  /* Status color classes */

  let statusColor = "bg-green-500";

  if (status === "Urgent") statusColor = "bg-red-500";
  if (status === "Upcoming") statusColor = "bg-yellow-500";
  if (status === "Completed") statusColor = "bg-green-600";
  if (status === "Incomplete") statusColor = "bg-red-600";
  if (status === "In Progress") statusColor = "bg-blue-500";


  return (

    <div
      onClick={handleNavigate}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col gap-4"
    >

      {/* Header */}

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold text-gray-800">
          {exam.examName}
        </h3>

        <span
          className={`text-xs text-white px-3 py-1 rounded-full ${statusColor}`}
        >
          {status}
        </span>

      </div>


      {/* Exam Info */}

      <div className="text-sm text-gray-600 space-y-1">

        <p>
          <span className="font-medium">Date:</span>{" "}
          {exam.date
            ? new Date(exam.date).toLocaleDateString("en-GB")
            : "No date"}
        </p>

        <p>
          <span className="font-medium">Days Remaining:</span>{" "}
          {days !== null ? days : "-"}
        </p>

      </div>


      {/* Progress */}

      <ProgressBar
        progress={progress}
        label="Exam Progress"
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
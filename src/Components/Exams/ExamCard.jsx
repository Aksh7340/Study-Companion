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

  /* =========================
     Status Color Mapping
  ========================= */

  let statusColor = "#22c55e";

  if (status === "Urgent") statusColor = "#ef4444";
  if (status === "Upcoming") statusColor = "#f59e0b";
  if (status === "Completed") statusColor = "#16a34a";
  if (status === "Incomplete") statusColor = "#dc2626";
  if (status === "In Progress") statusColor = "#3b82f6";


  return (

    <div
      className="exam-card"
      onClick={handleNavigate}
    >

      {/* Header */}

      <div className="exam-header">

        <h3>{exam.examName}</h3>

        <span
          className="exam-status"
          style={{ background: statusColor }}
        >
          {status}
        </span>

      </div>


      {/* Exam Info */}

      <p className="exam-date">

        Date:
        {exam.date
          ? new Date(exam.date).toLocaleDateString("en-GB")
          : " No date"}

      </p>


      <p className="exam-days">

        Days Remaining:
        {days !== null ? days : "-"}

      </p>


      {/* Progress */}

      <ProgressBar
        progress={progress}
        label="Exam Progress"
      />


      {/* Footer */}

      <div className="exam-footer">

        <button
          className="delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>

      </div>

    </div>

  );

}
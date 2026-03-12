import { useNavigate } from "react-router-dom";
import { getExamProgress, remainingDays } from "../../Logic/studyPlanner";
import ProgressBar from "../UI/ProgressBar";

export default function ExamCard({ exam, deleteExam, subjects }) {

  const navigate = useNavigate();

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

  return (
    <div
      className="card"
      onClick={handleNavigate}
      style={{ cursor: "pointer" }}
    >

      <h3>{exam.examName}</h3>

      <p>
        Date: {exam.date
          ? new Date(exam.date).toLocaleDateString("en-GB")
          : "No date"}
      </p>

      <p>
        Days Remaining: {exam.date ? remainingDays(exam.date) : "-"}
      </p>

      <ProgressBar
        progress={getExamProgress(exam._id, subjects)}
        label="Exam Progress"
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
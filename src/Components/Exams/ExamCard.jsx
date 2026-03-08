import { useNavigate } from "react-router-dom";
import { getExamProgress, remainingDays } from "../../Logic/studyPlanner";
import ProgressBar from "../UI/ProgressBar";

export default function ExamCard({ exam, deleteExam,subjects }) {

  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => navigate(`/dashboard/${exam.examId}`)}
    >

      <h3>{exam.examName}</h3>

      <p>Date: {exam.date}</p>

      <p>Days Remaining: {remainingDays(exam.date)}</p>

      <ProgressBar
      progress={getExamProgress(exam.examId,subjects)}
      label="Exam Progress"
      >

      </ProgressBar>

      <button className="button"
        onClick={(e) => {
          e.stopPropagation();
          deleteExam(exam.examId);
        }}
      >
        Delete
      </button>

    </div>
  );
}
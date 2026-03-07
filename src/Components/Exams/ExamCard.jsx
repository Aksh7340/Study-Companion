import { useNavigate } from "react-router-dom";
import { remainingDays } from "../../Logic/studyPlanner";

export default function ExamCard({ exam }) {

  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => navigate(`/dashboard/${exam.examId}`)}
    >

      <h3>{exam.examName}</h3>

      <p>Date: {exam.date}</p>

      <p>Days Remaining: {remainingDays(exam.date)}</p>

    </div>
  );
}
import { useNavigate, useParams } from "react-router-dom";

export default function MockResult({ result }) {

  const navigate = useNavigate();
  const { examId, subjectId, chapterId } = useParams();

  const percent = Math.round(
    (result.score / result.total) * 100
  );

  function goBack() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapterId}`);
  }

  return (
    <div className="section">

      <h2>Mock Test Result</h2>

      <h3>
        Score: {result.score} / {result.total}
      </h3>

      <p>Correct: {result.correct}</p>
      <p>Wrong: {result.wrong}</p>
      <p>Unattempted: {result.unattempted}</p>

      <p>{percent}%</p>

      {percent >= 70
        ? <p>Good performance</p>
        : <p>Needs more practice</p>
      }

      <button
        className="button"
        style={{ marginTop: "20px" }}
        onClick={goBack}
      >
        Back to Chapter
      </button>

    </div>
  );
}
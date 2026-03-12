import { useNavigate } from "react-router-dom";

export default function MockResult({
  result,
  examId,
  subjectId,
  chapterId
}) {

  const navigate = useNavigate();

  function goBack() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapterId}`);
  }

  return (

    <div className="section">

      <h2>Mock Test Result</h2>

      <p>Correct: {result.correct}</p>

      <p>Wrong: {result.wrong}</p>

      <p>Unattempted: {result.unattempted}</p>

      <p>
        Score: {result.score} / {result.total}
      </p>

      <button
        className="button"
        onClick={goBack}
      >
        Back to Chapter
      </button>

    </div>

  );

}
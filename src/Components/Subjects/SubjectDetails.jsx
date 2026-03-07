import { useParams, useNavigate } from "react-router-dom";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

export default function SubjectDetails({
  subjects,
  examData
}) {

  const { examId, subjectId } = useParams();

  const navigate = useNavigate();

  const exam = examData.find(
    e => e.examId === examId
  );

  const subject = subjects.find(
    s => s.id === subjectId
  );

  if (!exam || !subject) {
    return <p>Data not found</p>;
  }

  const weight = calculateSubjectWeight(subject);

  const hours = distributeDailyHours(
    subject,
    subjects,
    exam
  );

  return (
    <div className="section">

      <button
        className="button"
        onClick={() => navigate(`/dashboard/${examId}`)}
      >
        Back
      </button>

      <h2>{subject.name}</h2>

      <p>
        <strong>Chapters:</strong> {subject.chapters}
      </p>

      <p>
        <strong>Difficulty:</strong> {subject.difficulty}
      </p>

      <p>
        <strong>Weight:</strong> {weight}
      </p>

      <p>
        <strong>Daily Study Time:</strong> {hours}
      </p>

      <hr />

      <h3>Mock Test</h3>

      <button className="button">
        Start Mock Test
      </button>

      <p className="text-muted">
        Mock test results will appear here
      </p>

    </div>
  );
}
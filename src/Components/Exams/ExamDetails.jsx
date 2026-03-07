import { useParams, useNavigate } from "react-router-dom";

import SubjectList from "../Subjects/SubjectList";

export default function ExamDetails({ examData, subjects }) {

  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(e => e.examId === examId);

  if (!exam) return <p>Exam not found</p>;

  return (
    <div className="section">

      <button
        className="button"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>

      <h2>{exam.examName}</h2>

      <p>
        <strong>Date:</strong> {exam.date}
      </p>

      <p>
        <strong>Daily Study Hours:</strong> {exam.studyHours}
      </p>

      <hr />

      <h3>Subjects</h3>

      <SubjectList
        subjects={subjects}
        exam={exam}
      />

    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";

import SubjectList from "../Subjects/SubjectList";
import ExamHeader from "../Exams/ExamHeader"

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
      
      <ExamHeader exam={exam}></ExamHeader>
      
      <h3>Subjects</h3>

      <SubjectList
        subjects={subjects}
        exam={exam}
      />

    </div>
  );
}
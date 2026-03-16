import { getSubjectProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";

export default function WeakSubjects({ subjects, examId }) {

  const navigate = useNavigate();

  const examSubjects = subjects.filter(
    s => String(s.examId) === String(examId)
  );

  const weakSubjects = examSubjects.filter(
    subject => getSubjectProgress(subject) < 50
  );

  if (weakSubjects.length === 0) {

    return (
      <div className="section">
        <h3>Weak Subjects</h3>
        <p>No weak subjects 🎉</p>
      </div>
    );

  }

  return (

    <div className="section">

      <h3>Weak Subjects</h3>

      {weakSubjects.map(subject => (

        <div
          key={subject._id}
          className="card"
          style={{ marginBottom: "10px", cursor: "pointer" }}
          onClick={() =>
            navigate(`/dashboard/${examId}/${subject._id}`)
          }
        >

          <strong>{subject.name}</strong>

          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Progress: {getSubjectProgress(subject)}%
          </p>

        </div>

      ))}

    </div>

  );

}
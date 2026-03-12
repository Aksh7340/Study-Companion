import { useNavigate } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";
import { getSubjectProgress } from "../../Logic/studyPlanner";

export default function SubjectCard({
  subject,
  weight,
  hours,
  examId,
  deleteSubject
}) {

  const navigate = useNavigate();

  if (!subject) return null;

  const subjectId = subject._id;


  /* =========================
     Open Subject
  ========================= */

  function handleClick() {

    if (!subjectId) return;

    navigate(`/dashboard/${examId}/${subjectId}`);

  }


  /* =========================
     Delete Subject
  ========================= */

  function handleDelete(e) {

    e.stopPropagation();

    if (!subjectId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${subject.name}"?`
    );

    if (confirmDelete) {
      deleteSubject(subjectId);
    }

  }


  const progress = getSubjectProgress(subject);


  return (

    <div
      className="card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >

      <h3>{subject.name || "Unnamed Subject"}</h3>

      <p>Weight: {weight ?? "-"}</p>

      <p>Daily Study Time: {hours ?? "-"}</p>

      <ProgressBar
        progress={progress}
        label="Subject Progress"
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
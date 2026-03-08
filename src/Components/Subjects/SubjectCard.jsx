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

  function handleClick() {
    navigate(`/dashboard/${examId}/${subject.id}`);
  }

  return (
    <div
      className="card"
      onClick={handleClick}
    >
      <h3>{subject.name}</h3>

      <p>Weight: {weight}</p>

      <p>Daily Study Time: {hours}</p>

      <ProgressBar
      progress={getSubjectProgress(subject)}
      label="Subject Progress"></ProgressBar>

       <button className="button"
       onClick={(e)=>{
          e.stopPropagation();
          alert(`Want to delete ${subject.name}`)
          deleteSubject(subject.subjectId);
       }
      
       }>
        Delete
       </button>
    </div>
  );
}
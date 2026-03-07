import { useNavigate } from "react-router-dom";

export default function SubjectCard({
  subject,
  weight,
  hours,
  examId
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

    </div>
  );
}
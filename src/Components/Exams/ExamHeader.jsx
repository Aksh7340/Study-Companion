import { remainingDays } from "../../Logic/studyPlanner";

export default function ExamHeader({ exam }) {

  if (!exam) return null;


  /* =========================
     Format Date
  ========================= */

  const formattedDate = exam.date
    ? new Date(exam.date).toLocaleDateString("en-GB")
    : "No date";


  /* =========================
     Days Remaining
  ========================= */

  const daysRemaining = exam.date
    ? remainingDays(exam.date)
    : "-";


  const studyHours =
    exam.studyHours !== undefined && exam.studyHours !== null
      ? exam.studyHours
      : "-";


  return (

    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        background: "#f8f8f8"
      }}
    >

      <h2>{exam.examName}</h2>

      <p>
        <strong>Exam Date:</strong> {formattedDate}
      </p>

      <p>
        <strong>Days Remaining:</strong> {daysRemaining}
      </p>

      <p>
        <strong>Daily Study Hours:</strong> {studyHours}
      </p>

    </div>

  );

}
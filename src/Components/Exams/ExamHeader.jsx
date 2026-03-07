import { remainingDays } from "../../Logic/studyPlanner";

export default function ExamHeader({ exam }) {
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
        <strong>Exam Date:</strong> {exam.date}
      </p>

      <p>
        <strong>Days Remaining:</strong> {remainingDays(exam.date)}
      </p>

      <p>
        <strong>Daily Study Hours:</strong> {exam.studyHours}
      </p>
    </div>
  );
}
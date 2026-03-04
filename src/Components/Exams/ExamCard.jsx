export default function ExamCard({ exam, remainingDays, onClick }) {
console.log("Type of onClick (Exam card)",typeof(onClick))
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "10px",
        cursor: "pointer",
        borderRadius: "8px"
      }}
    >
      <h3>{exam.examName}</h3>
      <p>Date: {exam.date}</p>
      <p>Days Remaining: {remainingDays}</p>
    </div>
  );
}

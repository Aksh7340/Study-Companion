import ExamList from "../Components/Exams/ExamList";

export default function Dashboard({ examData }) {

  return (
    <div>

      <h2>Dashboard</h2>

      <ExamList examData={examData} />

    </div>
  );
}
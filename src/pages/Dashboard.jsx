import ExamList from "../Components/Exams/ExamList";

export default function Dashboard({
  examData = [],
  deleteExam,
  subjects = []
}) {

  return (

    <div className="dashboard">

      <h2>Dashboard</h2>

      {examData.length === 0 ? (

        <p>No exams added yet. Go to setup and create one.</p>

      ) : (

        <ExamList
          examData={examData}
          deleteExam={deleteExam}
          subjects={subjects}
        />

      )}

    </div>

  );

}
import ExamList from "../Components/Exams/ExamList";
import WeakChapters from "../Components/Analytics/WeakChapters";
import WeakSubjects from "../Components/Analytics/WeakSubjects";

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

        <>

          {/* ========================
              Exams Section
          ======================== */}

          <ExamList
            examData={examData}
            deleteExam={deleteExam}
            subjects={subjects}
          />



          {/* ========================
              Analytics Section
          ======================== */}

          <div className="dashboard-analytics">

            <h3>Study Insights</h3>

            <div className="analytics-grid">

              <WeakSubjects
                subjects={subjects}
                examId={examData[0]?._id}
              />

              <WeakChapters
                subjects={subjects}
              />

            </div>

          </div>

        </>

      )}

    </div>

  );

}
import ExamList from "../Components/Exams/ExamList";
import WeakChapters from "../Components/Analytics/WeakChapters";
import WeakSubjects from "../Components/Analytics/WeakSubjects";

export default function Dashboard({
  examData = [],
  deleteExam,
  subjects = []
}) {

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Track your exam preparation and identify weak areas.
        </p>
      </div>


      {/* Empty State */}

      {examData.length === 0 ? (

        <div className="bg-white p-8 rounded-xl shadow-sm text-center">

          <p className="text-gray-600 mb-4">
            No exams added yet.
          </p>

          <p className="text-sm text-gray-500">
            Go to Setup and create your first exam to start planning your study.
          </p>

        </div>

      ) : (

        <div className="space-y-10">

          {/* Exams Section */}

          <section>

            <h2 className="text-xl font-semibold mb-4">
              Your Exams
            </h2>

            <div className="bg-white rounded-xl shadow-sm p-6">

              <ExamList
                examData={examData}
                deleteExam={deleteExam}
                subjects={subjects}
              />

            </div>

          </section>


          {/* Analytics Section */}

          <section>

            <h2 className="text-xl font-semibold mb-6">
              Study Insights
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <WeakSubjects
                  subjects={subjects}
                  examId={examData[0]?._id}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <WeakChapters
                  subjects={subjects}
                />
              </div>

            </div>

          </section>

        </div>

      )}

    </div>

  );

}
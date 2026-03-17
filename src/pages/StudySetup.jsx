import ExamForm from "../Components/Setup/ExamForm";
import SubjectForm from "../Components/Setup/SubjectForm";

function StudySetup({
  examData = [],
  setExamData,
  subjects = [],
  setSubjects
}) {

  return (

    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Page Header */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Study Setup
        </h1>

        <p className="text-gray-500 mt-2">
          Create your exams and add subjects to start planning your study schedule.
        </p>
      </div>


      {/* Forms Layout */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* Exam Form */}

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

          <h2 className="text-xl font-semibold mb-4">
            Create Exam
          </h2>

          <ExamForm
            examData={examData}
            setExamData={setExamData}
          />

        </div>


        {/* Subject Form */}

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

          <h2 className="text-xl font-semibold mb-4">
            Add Subject
          </h2>

          <SubjectForm
            examData={examData}
            subjects={subjects}
            setSubjects={setSubjects}
          />

        </div>

      </div>

    </div>

  );

}

export default StudySetup;
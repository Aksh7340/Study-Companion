import ExamForm    from "../Components/Setup/ExamForm";
import SubjectForm  from "../Components/Setup/SubjectForm";

function StudySetup({ examData = [], setExamData, subjects = [], setSubjects }) {

  return (
    <div className="animate-fade-in">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Study Setup</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Create your exams and add subjects to start planning your study schedule.
        </p>
      </div>

      {/* Forms grid — stacks on mobile, 2-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Create Exam card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-1 gradient-primary" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">📋</span>
              <h2 className="text-lg font-bold text-slate-800">Create Exam</h2>
            </div>
            <ExamForm examData={examData} setExamData={setExamData} />
          </div>
        </div>

        {/* Add Subject card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-1 gradient-primary" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-lg">📚</span>
              <h2 className="text-lg font-bold text-slate-800">Add Subject</h2>
            </div>
            <SubjectForm examData={examData} subjects={subjects} setSubjects={setSubjects} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudySetup;
import ExamForm from "../Components/Setup/ExamForm";
import SubjectForm from "../Components/Setup/SubjectForm";
import "./StudySetup.css";

function StudySetup({
  examData = [],
  setExamData,
  subjects = [],
  setSubjects
}) {

  return (

    <div className="setup-container">

      <ExamForm
        examData={examData}
        setExamData={setExamData}
      />

      <SubjectForm
        examData={examData}
        subjects={subjects}
        setSubjects={setSubjects}
      />

    </div>

  );

}

export default StudySetup;
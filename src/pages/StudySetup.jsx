import ExamForm from "../Components/Setup/examForm";
import SubjectForm from "../Components/Setup/SubjectForm";
import "./StudySetup.css";

function StudySetup({ examData, setExamData, setSubjects,subjects }) {

  
  return (
    <>
      <ExamForm setExamData={setExamData} examData={examData}></ExamForm>
      <SubjectForm examData={examData} setSubjects={setSubjects} subjects={subjects}></SubjectForm>
    </>
  );
}

export default StudySetup;

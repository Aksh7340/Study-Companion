import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./pages/Home";
import StudySetup from "./pages/StudySetup";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";


import ExamDetails from "./Components/Exams/ExamDetails";
import SubjectDetails from "./Components/Subjects/SubjectDetails";
import ChapterDetails from "./Components/Chapters/ChapterDetails";

function App() {


  const [examData, setExamData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  function deleteExam(examId) {
  setExamData(prev =>
    prev.filter(exam => exam.examId !== examId)
  );
}

  function deleteSubject(subjectId){
    setSubjects(prev =>
      prev.filter(subject => subject.subjectId!=subjectId)
    )
  }

  function updateExam(updatedExam) {
  setExamData(prev =>
    prev.map(exam =>
      exam.examId === updatedExam.examId
        ? updatedExam
        : exam
    )
  );
}
function updateSubject(updatedSubject) {

  setSubjects(prev =>
    prev.map(sub =>
      sub.id === updatedSubject.id
        ? updatedSubject
        : sub
    )
  );

}

  return (
    <div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Container */}
      <main className="container">

        <Routes>
            <Route path="/auth" element={<Auth />} />

          {/* Home Page */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Setup Page */}
          <Route
            path="/setup"
            element={
              <StudySetup
                examData={examData}
                setExamData={setExamData}
                subjects={subjects}
                setSubjects={setSubjects}
              />
            }
          />

          {/* Dashboard Page */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                examData={examData}
                deleteExam={deleteExam}
                subjects={subjects}
              />
            }
          />

          {/* Exam Details */}
          <Route
            path="/dashboard/:examId"
            element={
              <ExamDetails
                examData={examData}
                subjects={subjects}
                deleteSubject={deleteSubject}
                updateExam={updateExam}
                
                
              />
            }
          />

          {/* Subject Details */}
          <Route
            path="/dashboard/:examId/:subjectId"
            element={
              <SubjectDetails
                subjects={subjects}
                examData={examData}
                updateSubject={updateSubject}
              />
            }
          />
          {/*Chapter Details */}
          <Route
         path="/dashboard/:examId/:subjectId/:chapterId"
         element={
       <ChapterDetails
      subjects={subjects}
      updateSubject={updateSubject}
    />
  }
/>

          {/* 404 Page */}
          <Route
            path="*"
            element={<h2>Page Not Found</h2>}
          />

        </Routes>

      </main>

    </div>
  );
}

export default App;
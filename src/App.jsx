import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./pages/Home";
import StudySetup from "./pages/StudySetup";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

import ExamDetails from "./Components/Exams/ExamDetails";
import SubjectDetails from "./Components/Subjects/SubjectDetails";

function App() {

  const [examData, setExamData] = useState([]);
  const [subjects, setSubjects] = useState([]);

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
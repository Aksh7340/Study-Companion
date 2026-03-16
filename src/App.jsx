import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./pages/Home";
import StudySetup from "./pages/StudySetup";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

import ExamDetails from "./Components/Exams/ExamDetails";
import SubjectDetails from "./Components/Subjects/SubjectDetails";
import ChapterDetails from "./Components/Chapters/ChapterDetails";
import MockTestPage from "./Components/MockTest/MockTestPage";

import ProtectedRoute from "./utils/ProtectedRoutes";

import api from "./Api/api";
import "./App.css";

function App() {

  const [examData, setExamData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  /* =========================
     Fetch Data
  ========================= */

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    async function fetchData() {

      try {

        const exams = await api.get("/exams");
        const subs = await api.get("/subjects");

        setExamData(exams.data);
        setSubjects(subs.data);

      } catch (error) {

        console.error(error);

      }

    }

    fetchData();

  }, []);


  /* =========================
     Update Exam
  ========================= */

  function updateExam(updatedExam) {

    setExamData(prev =>
      prev.map(exam =>
        String(exam._id) === String(updatedExam._id)
          ? updatedExam
          : exam
      )
    );

  }


  /* =========================
     Delete Exam
  ========================= */

  async function deleteExam(examId) {

    try {

      await api.delete(`/exams/${examId}`);

      setExamData(prev =>
        prev.filter(exam => String(exam._id) !== String(examId))
      );

    } catch (error) {

      console.error("Failed to delete exam", error);

    }

  }


  /* =========================
     Update Subject
  ========================= */

  function updateSubject(updatedSubject) {

    setSubjects(prev =>
      prev.map(sub =>
        String(sub._id) === String(updatedSubject._id)
          ? updatedSubject
          : sub
      )
    );

  }


  /* =========================
     Delete Subject
  ========================= */

  async function deleteSubject(subjectId) {

    try {

      await api.delete(`/subjects/${subjectId}`);

      setSubjects(prev =>
        prev.filter(sub => String(sub._id) !== String(subjectId))
      );

    } catch (error) {

      console.error("Failed to delete subject", error);

    }

  }


  /* =========================
     Update Chapter
  ========================= */

  function updateChapter(subjectId, chapterId, updatedChapter) {

    setSubjects(prev =>
      prev.map(subject => {

        if (String(subject._id) !== String(subjectId)) {
          return subject;
        }

        return {
          ...subject,
          chapters: subject.chapters.map(ch =>
            String(ch._id) === String(chapterId)
              ? updatedChapter
              : ch
          )
        };

      })
    );

  }


  return (

    <div>

      <Navbar />

      <main className="container">

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />


          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <StudySetup
                  examData={examData}
                  setExamData={setExamData}
                  subjects={subjects}
                  setSubjects={setSubjects}
                />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  examData={examData}
                  subjects={subjects}
                  deleteExam={deleteExam}
                />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/:examId"
            element={
              <ProtectedRoute>
                <ExamDetails
                  examData={examData}
                  subjects={subjects}
                  updateExam={updateExam}
                  deleteSubject={deleteSubject}
                />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/:examId/:subjectId"
            element={
              <ProtectedRoute>
                <SubjectDetails
                  subjects={subjects}
                  examData={examData}
                  updateSubject={updateSubject}
                />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/:examId/:subjectId/:chapterId"
            element={
              <ProtectedRoute>
                <ChapterDetails
                  subjects={subjects}
                  updateChapter={updateChapter}
                />
              </ProtectedRoute>
            }
          />


          <Route
            path="/dashboard/:examId/:subjectId/:chapterId/mock"
            element={
              <ProtectedRoute>
                <MockTestPage
                  subjects={subjects}
                  updateChapter={updateChapter}
                />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

    </div>

  );

}

export default App;
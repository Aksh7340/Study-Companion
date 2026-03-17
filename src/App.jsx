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

function App() {

  const [examData, setExamData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // ✅ NEW: Loading and error states
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchData() {

      try {

        setLoading(true);
        setDataError("");

        // ✅ IMPROVED: Better error handling with Promise.all
        const [examsRes, subsRes] = await Promise.all([
          api.get("/exams"),
          api.get("/subjects")
        ]);

        setExamData(examsRes.data);
        setSubjects(subsRes.data);

      } catch (error) {

        // ✅ IMPROVED: Better error message
        const errorMsg = 
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load data. Please refresh the page.";
        
        setDataError(errorMsg);
        console.error("Data fetch error:", error);

      }
      finally {
        setLoading(false);
      }

    }

    fetchData();

  }, []);

  function updateExam(updatedExam) {

    setExamData(prev =>
      prev.map(exam =>
        String(exam._id) === String(updatedExam._id)
          ? updatedExam
          : exam
      )
    );

  }

  async function deleteExam(examId) {

    try {

      await api.delete(`/exams/${examId}`);

      setExamData(prev =>
        prev.filter(exam => String(exam._id) !== String(examId))
      );

    } catch (error) {

      // ✅ IMPROVED: Better error handling
      const errorMsg = error?.response?.data?.message || "Failed to delete exam";
      setDataError(errorMsg);
      console.error("Delete exam error:", error);

    }

  }

  function updateSubject(updatedSubject) {

    setSubjects(prev =>
      prev.map(sub =>
        String(sub._id) === String(updatedSubject._id)
          ? updatedSubject
          : sub
      )
    );

  }

  async function deleteSubject(subjectId) {

    try {

      await api.delete(`/subjects/${subjectId}`);

      setSubjects(prev =>
        prev.filter(sub => String(sub._id) !== String(subjectId))
      );

    } catch (error) {

      const errorMsg = error?.response?.data?.message || "Failed to delete subject";
      setDataError(errorMsg);
      console.error("Delete subject error:", error);

    }

  }

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

    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation */}
      <Navbar />

      {/* ✅ NEW: Global Error Display */}
      {dataError && (
        <div className="bg-red-50 border-b-2 border-red-200 p-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{dataError}</p>
            <button 
              onClick={() => setDataError("")}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
                  loading={loading}
                  error={dataError}
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

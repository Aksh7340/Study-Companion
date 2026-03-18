import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar  from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";

import Home       from "./pages/Home";
import StudySetup from "./pages/StudySetup";
import Dashboard  from "./pages/Dashboard";
import Auth       from "./pages/Auth";

import ExamDetails    from "./Components/Exams/ExamDetails";
import SubjectDetails from "./Components/Subjects/SubjectDetails";
import ChapterDetails from "./Components/Chapters/ChapterDetails";
import MockTestPage   from "./Components/MockTest/MockTestPage";

import ProtectedRoute from "./utils/ProtectedRoutes";

import api from "./Api/api";

function App() {

  const [examData,  setExamData]  = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [dataError, setDataError] = useState("");

  /* ── Sidebar state (lifted here so main content can react) ─────── */
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const location = useLocation();

  /* Close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* ── Data Fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    async function fetchData() {
      try {
        setLoading(true);
        setDataError("");
        const [examsRes, subsRes] = await Promise.all([
          api.get("/exams"),
          api.get("/subjects")
        ]);
        setExamData(examsRes.data);
        setSubjects(subsRes.data);
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load data. Please refresh the page.";
        setDataError(errorMsg);
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ── Handlers ── */
  function updateExam(updatedExam) {
    setExamData(prev =>
      prev.map(exam =>
        String(exam._id) === String(updatedExam._id) ? updatedExam : exam
      )
    );
  }

  async function deleteExam(examId) {
    try {
      await api.delete(`/exams/${examId}`);
      setExamData(prev => prev.filter(exam => String(exam._id) !== String(examId)));
    } catch (error) {
      setDataError(error?.response?.data?.message || "Failed to delete exam");
    }
  }

  function updateSubject(updatedSubject) {
    setSubjects(prev =>
      prev.map(sub =>
        String(sub._id) === String(updatedSubject._id) ? updatedSubject : sub
      )
    );
  }

  async function deleteSubject(subjectId) {
    try {
      await api.delete(`/subjects/${subjectId}`);
      setSubjects(prev => prev.filter(sub => String(sub._id) !== String(subjectId)));
    } catch (error) {
      setDataError(error?.response?.data?.message || "Failed to delete subject");
    }
  }

  function updateChapter(subjectId, chapterId, updatedChapter) {
    setSubjects(prev =>
      prev.map(subject => {
        if (String(subject._id) !== String(subjectId)) return subject;
        return {
          ...subject,
          chapters: subject.chapters.map(ch =>
            String(ch._id) === String(chapterId) ? updatedChapter : ch
          )
        };
      })
    );
  }

  /* ── Sidebar visibility logic ── */
  const token        = localStorage.getItem("token");
  const isPublicPage = ["/", "/auth"].includes(location.pathname);
  const showSidebar  = !!token && !isPublicPage;

  /*
   * =========================================
   * FIX: RESPONSIVE MAIN CONTENT MARGIN
   * =========================================
   * Previously, the main layout area had a hardcoded left margin, which caused
   * massive empty white space on mobile devices and public pages where the sidebar
   * wasn't visible.
   *
   * Now, the `App.jsx` dynamically calculates the margin:
   * 1. If there's no sidebar (e.g., Auth/Home), margin is 0.
   * 2. On desktop, if the sidebar is visible, it uses the CSS variable for either 
   *    the expanded width (--sidebar-width) or the collapsed width (--sidebar-collapsed).
   * 3. On mobile (<768px), a CSS media query (defined in index.css) overrides this 
   *    and forces the margin to 0 since the sidebar becomes a hidden drawer.
   */
  const desktopMargin = showSidebar
    ? (sidebarCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)")
    : "0";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Navbar */}
      <Navbar
        onMenuToggle={() => setMobileOpen(o => !o)}
        mobileOpen={mobileOpen}
        showSidebar={showSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Sidebar */}
      <Sidebar
        examData={examData}
        subjects={subjects}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Global error banner */}
      {dataError && (
        <div
          className="fixed top-[60px] left-0 right-0 z-20 bg-red-50 border-b border-red-200 px-6 py-3
            flex justify-between items-center"
        >
          <p className="text-red-700 text-sm">{dataError}</p>
          <button
            onClick={() => setDataError("")}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
          >×</button>
        </div>
      )}

      {/*
        Main content
        - On mobile (<md): always margin 0 (sidebar is a drawer overlay)
        - On desktop (md+): margin depends on sidebar state
        - Public pages: always margin 0
      */}
      <main
        className="transition-all duration-300 pt-[60px]"
        style={{
          marginLeft: showSidebar ? desktopMargin : "0",
        }}
      >
        {/* On mobile, override marginLeft to 0 via a responsive class */}
        <style>{`
          @media (max-width: 767px) {
            main { margin-left: 0 !important; }
          }
        `}</style>

        <div className={`mx-auto py-6 ${showSidebar ? "px-4 sm:px-6 lg:px-8 max-w-7xl" : ""}`}>

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

        </div>
      </main>

    </div>
  );
}

export default App;

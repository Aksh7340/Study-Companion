import { useParams, useNavigate } from "react-router-dom";

import MockResultChart from "../Analytics/MockResultChart";

import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";

import MockHistory from "../MockTest/MockHistory";
import NotesManager from "../Notes/NotesManager";
import AssistantChat from "../Assistant/AssistantChat";

export default function ChapterDetails({
  subjects,
  updateChapter
}) {

  const { examId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();


  /* =========================
     Loading Guard
  ========================= */

  if (!subjects || subjects.length === 0) {
    return <p>Loading chapter...</p>;
  }


  /* =========================
     Find Subject
  ========================= */

  const subject = subjects.find(
    s => String(s._id) === String(subjectId)
  );

  if (!subject) {
    return <p>Subject not found</p>;
  }


  /* =========================
     Find Chapter
  ========================= */

  const chapter = subject.chapters?.find(
    ch => String(ch._id) === String(chapterId)
  );

  if (!chapter) {
    return <p>Chapter not found</p>;
  }


  /* =========================
     Analytics
  ========================= */

  const testsTaken = getChapterTestsTaken(chapter);
  const avgScore = getChapterAverageScore(chapter);
  const bestScore = getChapterBestScore(chapter);
  const progress = getChapterProgress(chapter);
  const status = getChapterStatus(chapter);


  /* =========================
     Navigation
  ========================= */

  function goBack() {
    navigate(`/dashboard/${examId}/${subjectId}`);
  }

  function startMock() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapterId}/mock`);
  }


  return (

    <div className="section">

      {/* Back Button */}

      <button
        className="button"
        onClick={goBack}
      >
        Back
      </button>


      {/* Title */}

      <h2 style={{ marginTop: "10px" }}>
        {chapter.name}
      </h2>

      <p>Status: <strong>{status}</strong></p>


      {/* =========================
          Analytics Cards
      ========================= */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <p className="analytics-title">Tests Taken</p>
          <h3 className="analytics-value">{testsTaken}</h3>
        </div>

        <div className="analytics-card">
          <p className="analytics-title">Best Score</p>
          <h3 className="analytics-value">
            {bestScore ?? "-"}
          </h3>
        </div>

        <div className="analytics-card">
          <p className="analytics-title">Average Score</p>
          <h3 className="analytics-value">
            {avgScore ? avgScore.toFixed(1) : "0.0"}
          </h3>
        </div>

        <div className="analytics-card">
          <p className="analytics-title">Progress</p>
          <h3 className="analytics-value">
            {progress}%
          </h3>
        </div>

      </div>


      {/* =========================
          Chart
      ========================= */}

      <div className="chart-container">

        <h3>Chapter Performance</h3>

        <MockResultChart chapter={chapter} />

      </div>


      {/* =========================
          Mock Test Section
      ========================= */}

      <div className="mock-section">

        <h3>Mock Test</h3>

        <button
          className="button"
          onClick={startMock}
        >
          Start Mock Test
        </button>

        <MockHistory chapter={chapter} />

      </div>


      {/* =========================
          Notes + AI Layout
      ========================= */}

      <div className="chapter-grid">

        <NotesManager
          chapter={chapter}
          subjectId={subjectId}
          chapterId={chapterId}
          updateChapter={updateChapter}
        />

        <AssistantChat
          chapter={chapter}
          subjectId={subjectId}
          chapterId={chapterId}
          updateChapter={updateChapter}
        />

      </div>

    </div>

  );

}
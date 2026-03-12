import { useParams, useNavigate } from "react-router-dom";

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

      <button
        className="button"
        onClick={goBack}
      >
        Back
      </button>


      <h2>{chapter.name}</h2>

      <p>Status: {status}</p>

      <p>Tests Taken: {testsTaken}</p>

      <p>Best Score: {bestScore ?? "-"}</p>

      <p>
        Average Score: {avgScore ? avgScore.toFixed(1) : "0.0"}
      </p>


      {/* Progress Bar */}

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p>{progress}% Complete</p>


      <hr />


      <button
        className="button"
        onClick={startMock}
      >
        Start Mock Test
      </button>


      {/* Mock History */}

      <MockHistory chapter={chapter} />


      {/* Notes */}

      <NotesManager
        chapter={chapter}
        subjectId={subjectId}
        chapterId={chapterId}
        updateChapter={updateChapter}
      />


      {/* AI Assistant */}

      <AssistantChat
        chapter={chapter}
        subjectId={subjectId}
        chapterId={chapterId}
        updateChapter={updateChapter}
      />

    </div>

  );

}
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


  if (!subjects || subjects.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading chapter...
      </p>
    );
  }


  const subject = subjects.find(
    s => String(s._id) === String(subjectId)
  );

  if (!subject) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Subject not found
      </p>
    );
  }


  const chapter = subject.chapters?.find(
    ch => String(ch._id) === String(chapterId)
  );

  if (!chapter) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Chapter not found
      </p>
    );
  }


  const testsTaken = getChapterTestsTaken(chapter);
  const avgScore = getChapterAverageScore(chapter);
  const bestScore = getChapterBestScore(chapter);
  const progress = getChapterProgress(chapter);
  const status = getChapterStatus(chapter);


  function goBack() {
    navigate(`/dashboard/${examId}/${subjectId}`);
  }

  function startMock() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapterId}/mock`);
  }


  return (

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* Back */}

      <button
        onClick={goBack}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        ← Back
      </button>


      {/* Header */}

      <div>

        <h1 className="text-2xl font-bold">
          {chapter.name}
        </h1>

        <p className="text-gray-600">
          Status: <span className="font-semibold">{status}</span>
        </p>

      </div>


      {/* Stats Cards */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Tests Taken</p>
          <h3 className="text-2xl font-bold">{testsTaken}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Best Score</p>
          <h3 className="text-2xl font-bold">
            {bestScore ?? "-"}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Average Score</p>
          <h3 className="text-2xl font-bold">
            {avgScore ? avgScore.toFixed(1) : "0.0"}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Progress</p>
          <h3 className="text-2xl font-bold">
            {progress}%
          </h3>
        </div>

      </div>


      {/* Performance Chart */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Chapter Performance
        </h2>

        <MockResultChart chapter={chapter} />

      </div>


      {/* Mock Test Section */}

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            Mock Test
          </h2>

          <button
            onClick={startMock}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Start Mock Test
          </button>

        </div>

        <MockHistory chapter={chapter} />

      </div>


      {/* Notes + AI */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <NotesManager
            chapter={chapter}
            subjectId={subjectId}
            chapterId={chapterId}
            updateChapter={updateChapter}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <AssistantChat
            chapter={chapter}
            subjectId={subjectId}
            chapterId={chapterId}
            updateChapter={updateChapter}
          />
        </div>

      </div>

    </div>

  );

}
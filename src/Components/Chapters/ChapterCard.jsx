import { useNavigate, useParams } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";
import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";


export default function ChapterCard({ chapter, deleteChapter }) {

  const navigate = useNavigate();

  const { examId, subjectId } = useParams();


  const testsTaken = getChapterTestsTaken(chapter);

  const avgScore = getChapterAverageScore(chapter);

  const bestScore = getChapterBestScore(chapter);

  const progress = getChapterProgress(chapter);

  const status = getChapterStatus(chapter);


  function openChapter(){
    navigate(`/dashboard/${examId}/${subjectId}/${chapter.id}`);
  }


  function handleDelete(e){
    e.stopPropagation();
    deleteChapter(chapter.id);
  }


  return (
    <div
      className="card"
      onClick={openChapter}
    >

      <h3>{chapter.name}</h3>

      <p>Status: {status}</p>

      <p>Tests Taken: {testsTaken}</p>

      <p>Best Score: {bestScore ?? "-"}</p>

      <p>Average Score: {avgScore.toFixed(1)}</p>

      <ProgressBar
          progress={progress}
          label="Chapter Progress"
      />

      <button
        className="button"
        onClick={handleDelete}
      >
        Delete
      </button>

    </div>
  );

}
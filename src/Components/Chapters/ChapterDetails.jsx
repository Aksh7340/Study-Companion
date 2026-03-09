import { useParams, useNavigate } from "react-router-dom";

import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";
import MockHistory from "../MockTest/MockHistory";


export default function ChapterDetails({
  subjects,
  
}) {

  const { examId, subjectId, chapterId } = useParams();

  const navigate = useNavigate();


  const subject =
    subjects.find(s => s.id === subjectId);

  if(!subject) return <p>Subject not found</p>;


  const chapter =
    subject.chapters.find(ch => ch.id === chapterId);

  if(!chapter) return <p>Chapter not found</p>;


  const testsTaken = getChapterTestsTaken(chapter);

  const avgScore = getChapterAverageScore(chapter);

  const bestScore = getChapterBestScore(chapter);

  const progress = getChapterProgress(chapter);

  const status = getChapterStatus(chapter);


 

  return (

    <div className="section">

      <button
        className="button"
        onClick={()=>navigate(`/dashboard/${examId}/${subjectId}`)}
      >
        Back
      </button>

      <h2>{chapter.name}</h2>

      <p>Status: {status}</p>

      <p>Tests Taken: {testsTaken}</p>

      <p>Best Score: {bestScore ?? "-"}</p>

      <p>Average Score: {avgScore.toFixed(1)}</p>


      <div className="progress-container">
        <div
          className="progress-bar"
          style={{width:`${progress}%`}}
        />
      </div>

      <p>{progress}% Complete</p>

      <hr></hr>
     
     <button
  className="button"
  onClick={() =>
    navigate(
      `/dashboard/${examId}/${subjectId}/${chapterId}/mock`
    )
  }
>
  Start Mock Test
</button>

<MockHistory chapter={chapter}></MockHistory>

   

     
    </div>

  );

}
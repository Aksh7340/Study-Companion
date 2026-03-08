import { useParams, useNavigate } from "react-router-dom";

import {
  getChapterAverageScore,
  getChapterBestScore,
  getChapterTestsTaken,
  getChapterProgress,
  getChapterStatus
} from "../../Logic/studyPlanner";


export default function ChapterDetails({
  subjects,
  updateSubject
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


  function startMockTest(){

    const score = Math.floor(Math.random()*10)+1;

    const newTest = {
      id: Date.now().toString(),
      score,
      total: 10,
      date: new Date().toLocaleDateString()
    };

    const updatedChapters =
      subject.chapters.map(ch =>
        ch.id === chapterId
          ? {
              ...ch,
              mockTests:[...ch.mockTests,newTest]
            }
          : ch
      );

    updateSubject({
      ...subject,
      chapters: updatedChapters
    });

  }


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


      <hr/>

      <h3>Mock Test History</h3>

      {chapter.mockTests.length === 0 &&
        <p>No tests yet</p>
      }

      {chapter.mockTests.map(test => (

        <div
          key={test.id}
          className="card"
        >
          <p>Score: {test.score}/{test.total}</p>
          <p>Date: {test.date}</p>
        </div>

      ))}


      <button
        className="button"
        onClick={startMockTest}
      >
        Start Mock Test
      </button>

    </div>

  );

}
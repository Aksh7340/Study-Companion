import { getChapterProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";

export default function WeakChapters({ subjects }) {

  const navigate = useNavigate();

  const weakChapters = [];

  subjects.forEach(subject => {

    subject.chapters?.forEach(chapter => {

      const progress = getChapterProgress(chapter);

      if (progress < 50) {

        weakChapters.push({
          subjectId: subject._id,
          subjectName: subject.name,
          chapter
        });

      }

    });

  });

  if (weakChapters.length === 0) {
    return (
      <div className="section">
        <h3>Weak Chapters</h3>
        <p>No weak chapters 🎉</p>
      </div>
    );
  }

  return (

    <div className="section">

      <h3>Weak Chapters</h3>

      {weakChapters.map((item, index) => (

        <div
          key={index}
          className="card"
          style={{ marginBottom: "10px", cursor: "pointer" }}
          onClick={() =>
            navigate(`/dashboard/${item.exam}/${item.subjectId}/${item.chapter._id}`)
          }
        >

          <strong>{item.chapter.name}</strong>

          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Subject: {item.subjectName}
          </p>

        </div>

      ))}

    </div>

  );

}
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

import ChapterList from "../Chapters/ChapterList";

export default function SubjectDetails({
  subjects,
  examData,
  updateSubject
}) {

  const { examId, subjectId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(e => e.examId === examId);
  const subject = subjects.find(s => s.id === subjectId);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  if (!exam || !subject) {
    return <p>Data not found</p>;
  }

  const weight = calculateSubjectWeight(subject);
  const hours = distributeDailyHours(subject, subjects, exam);

  function handleEdit() {
    setName(subject.name);
    setDifficulty(subject.difficulty);
    setEditing(true);
  }

  function handleSave() {
    updateSubject({
      ...subject,
      name,
      difficulty
    });

    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  return (
    <div className="section">

      <button
        className="button"
        onClick={() => navigate(`/dashboard/${examId}`)}
      >
        Back
      </button>

      {!editing && (
        <>
          <h2>{subject.name}</h2>

          <p>
            <strong>Chapters:</strong> {subject.chapters.length}
          </p>

          <p>
            <strong>Difficulty:</strong> {subject.difficulty}
          </p>

          <p>
            <strong>Weight:</strong> {weight}
          </p>

          <p>
            <strong>Daily Study Time:</strong> {hours}
          </p>

          <button
            className="button"
            onClick={handleEdit}
          >
            Edit
          </button>
        </>
      )}

      {editing && (
        <div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            className="button"
            style={{ margin: "10px" }}
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="button"
            onClick={handleCancel}
          >
            Cancel
          </button>

        </div>
      )}

    <hr />

     <h3>Chapters</h3>


<ChapterList
  subject={subject}
  updateSubject={updateSubject}
/>

    </div>
  );
}
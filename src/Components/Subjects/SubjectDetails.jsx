import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

import ChapterList from "../Chapters/ChapterList";
import ChapterPerformanceBar from "../Analytics/ChapterPerformanceBar";

export default function SubjectDetails({
  subjects,
  examData,
  updateSubject
}) {

  const { examId, subjectId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(
    e => String(e._id) === String(examId)
  );

  const subject = subjects.find(
    s => String(s._id) === String(subjectId)
  );


  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");


  /* =========================
     Sync edit fields
  ========================= */

  useEffect(() => {

    if (subject) {
      setName(subject.name || "");
      setDifficulty(subject.difficulty || "Easy");
    }

  }, [subject]);


  if (!exam || !subject) {
    return <p>Data not found</p>;
  }


  const weight = calculateSubjectWeight(subject);

  const hours = distributeDailyHours(
    subject,
    subjects,
    exam
  );


  /* =========================
     Edit Subject
  ========================= */

  function handleEdit() {
    setEditing(true);
  }


  /* =========================
     Save Subject
  ========================= */

  async function handleSave() {

    const updatedSubject = {
      ...subject,
      name: name.trim(),
      difficulty
    };

    try {

      await updateSubject(updatedSubject);

      setEditing(false);

    } catch (error) {

      console.error("Subject update failed", error);

    }

  }


  function handleCancel() {

    setName(subject.name);
    setDifficulty(subject.difficulty);

    setEditing(false);

  }


  return (

    <div className="section">

      <button
        className="button"
        onClick={() =>
          navigate(`/dashboard/${examId}`)
        }
      >
        Back
      </button>


      {/* =========================
         VIEW MODE
      ========================= */}

      {!editing && (
        <>
          <h2>{subject.name}</h2>

          <p>
            <strong>Chapters:</strong>{" "}
            {subject.chapters?.length || 0}
          </p>

          <p>
            <strong>Difficulty:</strong>{" "}
            {subject.difficulty}
          </p>

          <p>
            <strong>Daily Study Time:</strong>{" "}
            {hours}
          </p>

          <button
            className="button"
            onClick={handleEdit}
          >
            Edit
          </button>
        </>
      )}


      {/* =========================
         EDIT MODE
      ========================= */}

      {editing && (
        <div>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
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


      {/* =========================
         Chapter Section
      ========================= */}

      <ChapterList
        subject={subject}
        updateSubject={updateSubject}
      />


      {/* =========================
         Analytics
      ========================= */}

      <ChapterPerformanceBar
        subject={subject}
      />

    </div>

  );

}
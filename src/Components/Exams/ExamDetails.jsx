import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import SubjectList from "../Subjects/SubjectList";

export default function ExamDetails({ examData, subjects, updateExam,deleteSubject }) {

  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(e => e.examId === examId);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(exam?.examName || "");
  const [date, setDate] = useState(exam?.date || "");
  const [hours, setHours] = useState(exam?.studyHours || "");

  if (!exam) return <p>Exam not found</p>;

  function handleSave() {

    updateExam({
      ...exam,
      examName: name,
      date: date,
      studyHours: Number(hours)
    });

    setEditing(false);
  }

  function handleCancel() {
    setName(exam.examName);
    setDate(exam.date);
    setHours(exam.studyHours);
    setEditing(false);
  }

  return (
    <div className="section">

      <button
        className="button"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>

      {/* VIEW MODE */}
      {!editing && (
        <>
          <h2>{exam.examName}</h2>

          <p>Date: {exam.date}</p>

          <p>Daily Study Hours: {exam.studyHours}</p>

          <button
            className="button"
            onClick={() => setEditing(true)}
          >
            Edit Exam
          </button>
        </>
      )}

      {/* EDIT MODE */}
      {editing && (
        <div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <button
            className="button"
            style={{margin:"10px"}}
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

      <h3>Subjects</h3>

      <SubjectList
        subjects={subjects}
        exam={exam}
        deleteSubject={deleteSubject}
      />

    </div>
  );
}
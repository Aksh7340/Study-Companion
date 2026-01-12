import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./StudySetup.css";

function StudySetup({ examData, setExamData, setSubjects }) {

  // -------- Exam state --------
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [studyHours, setStudyHours] = useState("");

  // -------- Subject state --------
  const [name, setName] = useState("");
  const [chapters, setChapters] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedExamId, setSelectedExamId] = useState("");

  // -------- Add Exam --------
  function addExam() {
    if (!examName || !date || !studyHours) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) return;

    setExamData(prev => [
      ...prev,
      {
        examId: uuidv4(),
        examName,
        date,
        studyHours: Number(studyHours)
      }
    ]);

    setExamName("");
    setDate("");
    setStudyHours("");
  }

  // -------- Add Subject --------
  function addSubject() {
    if (!name || !chapters || !difficulty || !selectedExamId) return;

    setSubjects(prev => [
      ...prev,
      {
        id: uuidv4(),
        name,
        chapters: Number(chapters),
        difficulty,
        examId: selectedExamId
      }
    ]);

    setName("");
    setChapters("");
    setDifficulty("Easy");
    setSelectedExamId("");
  }

  return (
    <>
      {/* -------- Exam Section -------- */}
      <div className="exam-container">
        <h3>Exam Details</h3>

        <input
          type="text"
          placeholder="Exam Name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          min={1}
          placeholder="Daily Study Hours"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
        />

        <button onClick={addExam}>Add Exam</button>
      </div>

      {/* -------- Subject Section -------- */}
      <div className="subject-container">
        <h3>Subject Details</h3>

        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          min={1}
          placeholder="Chapters"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
        >
          <option value="" disabled>Select Exam</option>
          {examData.map(exam => (
            <option key={exam.examId} value={exam.examId}>
              {exam.examName}
            </option>
          ))}
        </select>

        <button onClick={addSubject}>Add Subject</button>
      </div>
    </>
  );
}

export default StudySetup;

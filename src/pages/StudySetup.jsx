import { useState } from "react";
import "./StudySetup.css"

function StudySetup() {
  // ---------- Subject-related state ----------
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [chapters, setChapters] = useState(0);

  // ---------- Exam-related state ----------
  const [date, setDate] = useState("");
  const [studyHours, setStudyHours] = useState("");

  // ---------- Add subject function ----------
  function addSub() {
    if (!name || !difficulty || !chapters) return;

    setSubjects((prev) => [
      ...prev,
      {
        name,
        chapters: Number(chapters),
        difficulty,
      },
    ]);

    setName("");
    setChapters("");
    setDifficulty("");
  }

  return (
    <>
      {/* ---------- Exam Details Section ---------- */}
      <div className="exam-container">
        <h3>Exam details</h3>

        <input
          type="date"
          placeholder="Enter the exam date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter the study hours"
          value={studyHours}
          onChange={(e) => setStudyHours((e) => setStudyHours(e.target.value))}
        />

        <button>Submit</button>
      </div>

      {/* ---------- Subject Details Section ---------- */}
      <div className="subject-container">
        <h3>Subject details</h3>

        <input
          type="text"
          placeholder="Enter the subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          min={1}
          placeholder="Enter the number of the chapters"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
        />

        <select
          id="Difficulty"
          name="Difficulty[]"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="" disabled>
            Select difficulty
          </option>
          <option value="Hard">Hard</option>
          <option value="Medium">Medium</option>
          <option value="Easy">Easy</option>
        </select>

        <button onClick={addSub}>Add Subject</button>
      </div>

      {/* ---------- Subjects List Section ---------- */}
      <h1>Your Subjects</h1>

      <ul className="sub-list">
        {subjects.map((subject, index) => (
          <li key={index} className="list-item">
            <div>
              <h1>{subject.name}</h1>
              <p>Total Chapters: {subject.chapters}</p>
              <p>Difficulty: {subject.difficulty}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default StudySetup;

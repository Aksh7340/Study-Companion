import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SubjectForm({ examData, subjects, setSubjects }) {

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState([]);

  const [errors, setErrors] = useState({});

  function addChapter() {
    if (!chapterName.trim()) return;

    const newChapter = {
      id: uuidv4(),
      name: chapterName.trim(),
      completed: false,
      mockTests: []
    };

    setChapters(prev => [...prev, newChapter]);
    setChapterName("");
  }

  function removeChapter(id) {
    setChapters(prev => prev.filter(ch => ch.id !== id));
  }

  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Subject name is required";
    }

    if (!selectedExamId) {
      newErrors.selectedExamId = "Please select an exam";
    }

    if (chapters.length === 0) {
      newErrors.chapters = "Add at least one chapter";
    }

    const duplicate = subjects.some(
      sub =>
        sub.examId === selectedExamId &&
        sub.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
      newErrors.name = "Subject already exists for this exam";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function addSubject() {

    if (!validate()) return;

    const newSubject = {
      id: uuidv4(),
      name: name.trim(),
      difficulty,
      examId: selectedExamId,
      chapters
    };

    setSubjects(prev => [...prev, newSubject]);

    setName("");
    setDifficulty("Easy");
    setSelectedExamId("");
    setChapters([]);
    setErrors({});
  }

  return (
    <div className="subject-container">

      <h3>Subject Details</h3>

      <input
        type="text"
        placeholder="Subject Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p className="error">{errors.name}</p>}

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
        disabled={examData.length === 0}
      >
        <option value="" disabled>Select Exam</option>

        {examData.map(exam => (
          <option key={exam.examId} value={exam.examId}>
            {exam.examName}
          </option>
        ))}

      </select>

      {errors.selectedExamId && (
        <p className="error">{errors.selectedExamId}</p>
      )}

      <hr />

      <h4>Add Chapters</h4>

      <input
        type="text"
        placeholder="Chapter name"
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
      />

      <button onClick={addChapter}>
        Add Chapter
      </button>

      {errors.chapters && (
        <p className="error">{errors.chapters}</p>
      )}

      <div>

        {chapters.map(ch => (
          <div key={ch.id} className="card">

            {ch.name}

            <button onClick={() => removeChapter(ch.id)}>
              Remove
            </button>

          </div>
        ))}

      </div>

      <button onClick={addSubject}>
        Add Subject
      </button>

    </div>
  );
}
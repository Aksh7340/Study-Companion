import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SubjectForm({ examData, subjects, setSubjects }) {

  const [name, setName] = useState("");
  const [chapters, setChapters] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Subject name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Subject name must be at least 3 characters";
    }

    if (!chapters) {
      newErrors.chapters = "Chapters required";
    } else if (Number(chapters) <= 0) {
      newErrors.chapters = "Chapters must be greater than 0";
    }

    if (!selectedExamId) {
      newErrors.selectedExamId = "Please select an exam";
    }

    // Duplicate subject check (within same exam)
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

    setSubjects(prev => [
      ...prev,
      {
        id: uuidv4(),
        name: name.trim(),
        chapters: Number(chapters),
        difficulty,
        examId: selectedExamId
      }
    ]);

    setName("");
    setChapters("");
    setDifficulty("Easy");
    setSelectedExamId("");
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

      <input
        type="number"
        min={1}
        placeholder="Chapters"
        value={chapters}
        onChange={(e) => setChapters(e.target.value)}
      />
      {errors.chapters && <p className="error">{errors.chapters}</p>}

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

      <button onClick={addSubject}>Add Subject</button>
    </div>
  );
}

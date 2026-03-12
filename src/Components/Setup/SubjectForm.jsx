import { useState } from "react";
import api from "../../Api/api";

export default function SubjectForm({ examData, subjects, setSubjects }) {

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState([]);

  const [errors, setErrors] = useState({});


  /* =========================
     Add Chapter (Local)
  ========================= */

  function addChapter() {

    const trimmed = chapterName.trim();

    if (!trimmed) return;

    const duplicate = chapters.some(
      ch => ch.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicate) return;

    const newChapter = {
      name: trimmed,
      mockTests: [],
      notes: [],
      assistantChats: []
    };

    setChapters(prev => [...prev, newChapter]);
    setChapterName("");

  }


  function removeChapter(index) {

    setChapters(prev =>
      prev.filter((_, i) => i !== index)
    );

  }


  /* =========================
     Validation
  ========================= */

  function validate() {

    const newErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
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
        String(sub.examId) === String(selectedExamId) &&
        sub.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      newErrors.name = "Subject already exists for this exam";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }


  /* =========================
     Create Subject
  ========================= */

  async function addSubject() {

    if (!validate()) return;

    try {

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/subjects",
        {
          name: name.trim(),
          difficulty,
          examId: selectedExamId,
          chapters
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newSubject = res.data;

      setSubjects(prev => [...prev, newSubject]);

      setName("");
      setDifficulty("Easy");
      setSelectedExamId("");
      setChapters([]);
      setErrors({});

    } catch (error) {

      console.error("Error adding subject:", error);

    }

  }


  /* =========================
     Enter Key for Subject
  ========================= */

  function handleKeyDown(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }

  }


  return (

    <div className="subject-container">

      <h3>Subject Details</h3>

      <input
        type="text"
        placeholder="Subject Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
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
          <option key={exam._id} value={exam._id}>
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
        onKeyDown={(e) => {
          if (e.key === "Enter") addChapter();
        }}
      />

      <button
        className="button"
        onClick={addChapter}
      >
        Add Chapter
      </button>

      {errors.chapters && (
        <p className="error">{errors.chapters}</p>
      )}



      <div>

        {chapters.map((ch, index) => (

          <div key={ch.name} className="card">

            {ch.name}

            <button
              className="button"
              onClick={() => removeChapter(index)}
            >
              Remove
            </button>

          </div>

        ))}

      </div>



      <button
        className="button"
        onClick={addSubject}
      >
        Add Subject
      </button>

    </div>

  );

}
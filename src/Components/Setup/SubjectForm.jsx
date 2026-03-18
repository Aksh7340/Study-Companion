import { useState } from "react";
import api from "../../Api/api";

export default function SubjectForm({ examData, subjects, setSubjects }) {

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState([]);

  const [errors, setErrors] = useState({});


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


  function handleKeyDown(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }

  }


  return (

    <div className="space-y-6">

      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Subject Details
      </h3>


      {/* Subject Name */}

      <div className="space-y-1">

        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name}
          </p>
        )}

      </div>


      {/* Difficulty */}

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="input-field"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>


      {/* Exam Selection */}

      <div className="space-y-1">

        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          disabled={examData.length === 0}
          className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <option value="" disabled>Select Exam</option>

          {examData.map(exam => (
            <option key={exam._id} value={exam._id}>
              {exam.examName}
            </option>
          ))}

        </select>

        {errors.selectedExamId && (
          <p className="text-sm text-red-500">
            {errors.selectedExamId}
          </p>
        )}

      </div>


      {/* Chapters Section */}

      <div className="space-y-3">

        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Add Chapters
        </h4>

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Chapter name"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addChapter();
            }}
            className="input-field flex-1"
          />

          <button
            onClick={addChapter}
            className="btn-primary px-4 py-2"
          >
            Add
          </button>

        </div>

        {errors.chapters && (
          <p className="text-sm text-red-500">
            {errors.chapters}
          </p>
        )}


        {/* Chapter List */}

        <div className="space-y-2">

          {chapters.map((ch, index) => (

            <div
              key={ch.name}
              className="flex justify-between items-center bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
            >

              <span>{ch.name}</span>

              <button
                onClick={() => removeChapter(index)}
                className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      </div>


      {/* Submit Button */}

      <button
        onClick={addSubject}
        className="btn-primary w-full py-3"
      >
        Add Subject
      </button>

    </div>

  );

}
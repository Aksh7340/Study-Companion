import { useState } from "react";
import api from "../../Api/api";

export default function ExamForm({ setExamData, examData }) {

  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  /* =========================
     Validation
  ========================= */

  function validate() {

    const newErrors = {};
    const trimmedName = examName.trim();

    if (!trimmedName) {
      newErrors.examName = "Exam name is required";
    } 
    else {

      const examExists = examData.some(
        exam =>
          exam.examName?.trim().toLowerCase() ===
          trimmedName.toLowerCase()
      );

      if (examExists) {
        newErrors.examName = "Exam already exists";
      }

    }

    if (!date) {
      newErrors.date = "Exam date is required";
    } 
    else {

      const today = new Date();
      today.setHours(0,0,0,0);

      const selectedDate = new Date(date);
      selectedDate.setHours(0,0,0,0);

      if (selectedDate <= today) {
        newErrors.date = "Date must be in the future";
      }

    }

    if (!studyHours) {
      newErrors.studyHours = "Study hours required";
    }
    else if (Number(studyHours) <= 0) {
      newErrors.studyHours = "Study hours must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }


  /* =========================
     Add Exam
  ========================= */

  async function addExam() {

    if (!validate()) return;

    const trimmedName = examName.trim();

    try {

      setLoading(true);

      const res = await api.post("/exams", {
        examName: trimmedName,
        date,
        studyHours: Number(studyHours)
      });

      const newExam = res.data;

      setExamData(prev => [...prev, newExam]);

      setExamName("");
      setDate("");
      setStudyHours("");
      setErrors({});

    }
    catch (error) {

      console.error("Error adding exam:", error);

    }
    finally {

      setLoading(false);

    }

  }


  /* =========================
     Enter Key Submit
  ========================= */

  function handleKeyDown(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      addExam();
    }

  }


  return (

    <div className="exam-container">

      <h3>Exam Details</h3>

      <input
        type="text"
        placeholder="Exam Name"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {errors.examName && <p className="error">{errors.examName}</p>}


      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {errors.date && <p className="error">{errors.date}</p>}


      <input
        type="number"
        min={1}
        placeholder="Daily Study Hours"
        value={studyHours}
        onChange={(e) => setStudyHours(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {errors.studyHours && (
        <p className="error">{errors.studyHours}</p>
      )}


      <button
        className="button"
        onClick={addExam}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Exam"}
      </button>

    </div>

  );

}
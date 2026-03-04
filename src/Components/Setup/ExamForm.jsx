import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ExamForm({ setExamData, examData }) {


  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    console.log("addExam called");
    const newErrors = {};
    const trimmedName = examName.trim();

    // Exam name validation
   

if (!trimmedName) {
  newErrors.examName = "Exam name is required";
} else {
  const examExists = examData.some(
    exam =>
      exam.examName.trim().toLowerCase() === trimmedName.toLowerCase()
  );

  if (examExists) {
    newErrors.examName = "Exam already exists";
  }
}

    // Date validation
    if (!date) {
      newErrors.date = "Exam date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.date = "Date must be in the future";
      }
    }

    // Study hours validation
    if (!studyHours) {
      newErrors.studyHours = "Study hours required";
    } else if (Number(studyHours) <= 0) {
      newErrors.studyHours = "Study hours must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function addExam() {
    if (!validate()) return;
    

    const trimmedName = examName.trim();

    setExamData(prev => [
      ...prev,
      {
        examId: uuidv4(),
        examName: trimmedName,
        date,
        studyHours: Number(studyHours)
      }
    ]);

    // reset form
    setExamName("");
    setDate("");
    setStudyHours("");
    setErrors({});
  }

  return (
    <div className="exam-container">
      <h3>Exam Details</h3>

      <input
        type="text"
        placeholder="Exam Name"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
      />
      {errors.examName && <p className="error">{errors.examName}</p>}

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {errors.date && <p className="error">{errors.date}</p>}

      <input
        type="number"
        min={1}
        placeholder="Daily Study Hours"
        value={studyHours}
        onChange={(e) => setStudyHours(e.target.value)}
      />
      {errors.studyHours && <p className="error">{errors.studyHours}</p>}

      <button onClick={addExam}>Add Exam</button>
    </div>
  );
}
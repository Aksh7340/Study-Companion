

import { useState } from "react";
import ExamList from "../Components/Exams/ExamList";

export default function Dashboard({ examData }) {

  const [selectedExam, setSelectedExam] = useState(null);

  return (
    <div>
      <h2>Dashboard</h2>

      {!selectedExam && (
        <ExamList
          examData={examData}
          onSelectExam={setSelectedExam}
        />
      )}

      {selectedExam && (
        <div>
          <button onClick={() => setSelectedExam(null)}>
            Back
          </button>

          <h3>{selectedExam.examName}</h3>
          <p>Date: {selectedExam.date}</p>
        </div>
      )}
    </div>
  );
}

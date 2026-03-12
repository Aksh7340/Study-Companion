import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SubjectList from "../Subjects/SubjectList";
import SubjectPieChart from "../Analytics/SubjectPieChart";

export default function ExamDetails({
  examData,
  subjects,
  updateExam
}) {

  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(e => String(e._id) === String(examId));

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {

    if (exam) {

      setName(exam.examName);
      setDate(exam.date?.slice(0,10));
      setHours(exam.studyHours);

    }

  }, [exam]);

  if (!exam) return <p>Exam not found</p>;


  /* =========================
     Save Exam
  ========================= */

  async function handleSave() {

    try {

      const updatedExam = {
        ...exam,
        examName: name,
        date,
        studyHours: Number(hours)
      };

      await updateExam(updatedExam);

      setEditing(false);

    } catch (error) {

      console.error("Failed to update exam", error);

    }

  }


  function handleCancel() {

    setName(exam.examName);
    setDate(exam.date?.slice(0,10));
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


      {!editing && (
        <>
          <h2>{exam.examName}</h2>

          <p>
            Date: {exam.date
              ? new Date(exam.date).toLocaleDateString("en-GB")
              : "No date"}
          </p>

          <p>
            Daily Study Hours: {exam.studyHours}
          </p>

          <button
            className="button"
            onClick={() => setEditing(true)}
          >
            Edit Exam
          </button>
        </>
      )}


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
            style={{ margin: "10px" }}
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

      <SubjectPieChart
        subjects={subjects}
        examId={exam._id}
      />

      <h3>Subjects</h3>

      <SubjectList
        subjects={subjects}
        exam={exam}
      />

    </div>

  );

}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SubjectList from "../Subjects/SubjectList";
import SubjectPieChart from "../Analytics/SubjectPieChart";

import {
  getExamProgress
} from "../../Logic/studyPlanner";

export default function ExamDetails({
  examData,
  subjects,
  updateExam
}) {

  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(e => String(e._id) === String(examId));

  const examSubjects = subjects.filter(
    s => String(s.examId) === String(examId)
  );

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

  if (!exam) return <p className="text-center mt-10">Exam not found</p>;


  const progress = getExamProgress(exam._id, subjects);

  const totalSubjects = examSubjects.length;

  const totalChapters = examSubjects.reduce(
    (sum,s)=> sum + (s.chapters?.length || 0),
    0
  );


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

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* Back Button */}

      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        ← Back
      </button>


      {/* Exam Info */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        {!editing && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              {exam.examName}
            </h1>

            <p className="text-gray-600">
              Date: {exam.date
                ? new Date(exam.date).toLocaleDateString("en-GB")
                : "No date"}
            </p>

            <p className="text-gray-600">
              Daily Study Hours: {exam.studyHours}
            </p>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Exam
            </button>
          </>
        )}


        {editing && (

          <div className="space-y-3">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="flex gap-3 pt-2">

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>


      {/* Quick Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Subjects</p>
          <h3 className="text-2xl font-bold">{totalSubjects}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Total Chapters</p>
          <h3 className="text-2xl font-bold">{totalChapters}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-sm">Study Hours / Day</p>
          <h3 className="text-2xl font-bold">{exam.studyHours}</h3>
        </div>

      </div>


      {/* Subject Chart */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Subject Distribution
        </h2>

        <SubjectPieChart
          subjects={subjects}
          examId={exam._id}
        />

      </div>


      {/* Subjects */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Subjects
        </h2>

        <SubjectList
          subjects={subjects}
          exam={exam}
        />

      </div>

    </div>

  );

}
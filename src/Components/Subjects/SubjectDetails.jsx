import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

import ChapterList from "../Chapters/ChapterList";
import ChapterPerformanceBar from "../Analytics/ChapterPerformanceBar";

export default function SubjectDetails({
  subjects,
  examData,
  updateSubject
}) {

  const { examId, subjectId } = useParams();
  const navigate = useNavigate();

  const exam = examData.find(
    e => String(e._id) === String(examId)
  );

  const subject = subjects.find(
    s => String(s._id) === String(subjectId)
  );

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  useEffect(() => {

    if (subject) {
      setName(subject.name || "");
      setDifficulty(subject.difficulty || "Easy");
    }

  }, [subject]);

  if (!exam || !subject) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Data not found
      </p>
    );
  }

  const weight = calculateSubjectWeight(subject);

  const hours = distributeDailyHours(
    subject,
    subjects,
    exam
  );


  function handleEdit() {
    setEditing(true);
  }


  async function handleSave() {

    const updatedSubject = {
      ...subject,
      name: name.trim(),
      difficulty
    };

    try {

      await updateSubject(updatedSubject);
      setEditing(false);

    } catch (error) {

      console.error("Subject update failed", error);

    }

  }


  function handleCancel() {

    setName(subject.name);
    setDifficulty(subject.difficulty);

    setEditing(false);

  }


  return (

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* Back Button */}

      <button
        onClick={() => navigate(`/dashboard/${examId}`)}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        ← Back
      </button>


      {/* Subject Info */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        {!editing && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              {subject.name}
            </h1>

            <p className="text-gray-600">
              Chapters: {subject.chapters?.length || 0}
            </p>

            <p className="text-gray-600">
              Difficulty: {subject.difficulty}
            </p>

            <p className="text-gray-600">
              Daily Study Time: {hours}
            </p>

            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Subject
            </button>
          </>
        )}


        {editing && (

          <div className="space-y-3">

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

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


      {/* Chapters */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Chapters
        </h2>

        <ChapterList
          subject={subject}
          updateSubject={updateSubject}
        />

      </div>


      {/* Analytics */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Chapter Performance
        </h2>

        <ChapterPerformanceBar
          subject={subject}
        />

      </div>

    </div>

  );

}
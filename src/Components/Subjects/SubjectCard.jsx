import { useNavigate } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";
import { getSubjectProgress } from "../../Logic/studyPlanner";

export default function SubjectCard({
  subject,
  weight,
  hours,
  examId,
  deleteSubject
}) {

  const navigate = useNavigate();

  if (!subject) return null;

  const subjectId = subject._id;

  function handleClick() {

    if (!subjectId) return;

    navigate(`/dashboard/${examId}/${subjectId}`);

  }


  function handleDelete(e) {

    e.stopPropagation();

    if (!subjectId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${subject.name}"?`
    );

    if (confirmDelete) {
      deleteSubject(subjectId);
    }

  }


  const progress = getSubjectProgress(subject);


  return (

    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col gap-3"
    >

      {/* Subject Name */}

      <h3 className="text-lg font-semibold text-gray-800">
        {subject.name || "Unnamed Subject"}
      </h3>


      {/* Subject Stats */}

      <div className="text-sm text-gray-600 space-y-1">

        <p>
          <span className="font-medium">Weight:</span> {weight ?? "-"}
        </p>

        <p>
          <span className="font-medium">Daily Study Time:</span> {hours ?? "-"}
        </p>

      </div>


      {/* Progress */}

      <ProgressBar
        progress={progress}
        label="Subject Progress"
      />


      {/* Delete Button */}

      <div className="flex justify-end pt-2">

        <button
          onClick={handleDelete}
          className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>

      </div>

    </div>

  );

}
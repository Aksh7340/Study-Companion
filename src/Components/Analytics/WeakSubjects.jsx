import { getSubjectProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";

export default function WeakSubjects({ subjects, examId }) {

  const navigate = useNavigate();

  const examSubjects = subjects.filter(
    s => String(s.examId) === String(examId)
  );

  const weakSubjects = examSubjects.filter(
    subject => getSubjectProgress(subject) < 50
  );

  if (weakSubjects.length === 0) {

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h3 className="text-lg font-semibold mb-2">
          Weak Subjects
        </h3>

        <p className="text-sm text-gray-500">
          No weak subjects 🎉
        </p>

      </div>
    );

  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

      <h3 className="text-lg font-semibold">
        Weak Subjects
      </h3>

      {weakSubjects.map(subject => (

        <div
          key={subject._id}
          onClick={() =>
            navigate(`/dashboard/${examId}/${subject._id}`)
          }
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
        >

          <p className="font-medium text-gray-800">
            {subject.name}
          </p>

          <p className="text-sm text-gray-500">
            Progress: {getSubjectProgress(subject)}%
          </p>

        </div>

      ))}

    </div>

  );

}
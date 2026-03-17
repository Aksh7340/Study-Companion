import { useNavigate } from "react-router-dom";

export default function MockResult({
  result,
  examId,
  subjectId,
  chapterId
}) {

  const navigate = useNavigate();

  function goBack() {
    navigate(`/dashboard/${examId}/${subjectId}/${chapterId}`);
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg w-full space-y-6">

        {/* Title */}

        <h2 className="text-2xl font-bold text-center">
          Mock Test Result
        </h2>


        {/* Score */}

        <div className="text-center">

          <p className="text-gray-500">
            Your Score
          </p>

          <h3 className="text-3xl font-bold text-indigo-600">
            {result.score} / {result.total}
          </h3>

        </div>


        {/* Result Stats */}

        <div className="grid grid-cols-3 gap-4 text-center">

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Correct</p>
            <p className="text-xl font-bold text-green-600">
              {result.correct}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Wrong</p>
            <p className="text-xl font-bold text-red-600">
              {result.wrong}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Unattempted</p>
            <p className="text-xl font-bold text-gray-700">
              {result.unattempted}
            </p>
          </div>

        </div>


        {/* Back Button */}

        <button
          onClick={goBack}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Chapter
        </button>

      </div>

    </div>

  );

}
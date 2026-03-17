import { remainingDays } from "../../Logic/studyPlanner";

export default function ExamHeader({ exam }) {

  if (!exam) return null;

  /* Format Date */

  const formattedDate = exam.date
    ? new Date(exam.date).toLocaleDateString("en-GB")
    : "No date";

  /* Days Remaining */

  const daysRemaining = exam.date
    ? remainingDays(exam.date)
    : "-";

  const studyHours =
    exam.studyHours !== undefined && exam.studyHours !== null
      ? exam.studyHours
      : "-";


  return (

    <div className="bg-white p-6 rounded-xl shadow-sm">

      <h1 className="text-2xl font-bold mb-4">
        {exam.examName}
      </h1>

      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">

        <div>
          <p className="text-gray-500">Exam Date</p>
          <p className="font-semibold text-gray-800">
            {formattedDate}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Days Remaining</p>
          <p className="font-semibold text-gray-800">
            {daysRemaining}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Study Hours / Day</p>
          <p className="font-semibold text-gray-800">
            {studyHours}
          </p>
        </div>

      </div>

    </div>

  );

}
import { remainingDays } from "../../Logic/studyPlanner";
import ExamCard from "./ExamCard";

export default function ExamList({ examData = [], deleteExam, subjects }) {

  if (examData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No exams added yet
      </div>
    );
  }

  /* Sort Exams by Remaining Days */

  const sortedExams = [...examData].sort((a, b) => {

    const daysA = a?.date ? remainingDays(a.date) : Infinity;
    const daysB = b?.date ? remainingDays(b.date) : Infinity;

    return daysA - daysB;

  });

  return (

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {sortedExams.map(exam => (

        <ExamCard
          key={exam._id}
          exam={exam}
          deleteExam={deleteExam}
          subjects={subjects}
        />

      ))}

    </div>

  );

}
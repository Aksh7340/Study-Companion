import { remainingDays } from "../../Logic/studyPlanner";
import ExamCard from "./ExamCard";

export default function ExamList({ examData = [], deleteExam, subjects }) {

  if (examData.length === 0) {
    return <p>No exams added yet</p>;
  }

  /* =========================
     Sort Exams by Remaining Days
  ========================= */

  const sortedExams = [...examData].sort((a, b) => {

    const daysA = a?.date ? remainingDays(a.date) : Infinity;
    const daysB = b?.date ? remainingDays(b.date) : Infinity;

    return daysA - daysB;

  });

  return (

    <>

      {sortedExams.map(exam => (

        <ExamCard
          key={exam._id}
          exam={exam}
          deleteExam={deleteExam}
          subjects={subjects}
        />

      ))}

    </>

  );

}
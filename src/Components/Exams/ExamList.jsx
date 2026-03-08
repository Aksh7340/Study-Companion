import { remainingDays } from "../../Logic/studyPlanner";
import ExamCard from "./ExamCard";

export default function ExamList({ examData, onSelectExam , deleteExam ,subjects}) {

   
  return (
    <>
    
      {examData
        .slice()
        .sort((a, b) => remainingDays(a.date) - remainingDays(b.date))
        .map(exam => {
          const days = remainingDays(exam.date);

          return (
            <ExamCard
              key={exam.examId}
              exam={exam}
              remainingDays={days}
              onClick={() => onSelectExam(exam)}
              deleteExam={deleteExam}
              subjects={subjects}
            />
            
          );
        })}
    </>
  );
}

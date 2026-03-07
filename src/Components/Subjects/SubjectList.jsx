import SubjectCard from "./SubjectCard";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

export default function SubjectList({ subjects, exam }) {

  const examSubjects = subjects
    .filter(sub => sub.examId === exam.examId)
    .sort(
      (a, b) =>
        calculateSubjectWeight(b) -
        calculateSubjectWeight(a)
    );

  if (examSubjects.length === 0) {
    return <p>No subjects added yet</p>;
  }

  return (
    <div className="subject-list">

      {examSubjects.map(sub => {

        const weight = calculateSubjectWeight(sub);

        const hours = distributeDailyHours(
          sub,
          subjects,
          exam
        );

        return (
          <SubjectCard
            key={sub.id}
            subject={sub}
            examId={exam.examId}
            weight={weight}
            hours={hours}
          />
        );
      })}

    </div>
  );
}
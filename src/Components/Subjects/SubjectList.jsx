import SubjectCard from "./SubjectCard";

import {
  calculateSubjectWeight,
  distributeDailyHours
} from "../../Logic/studyPlanner";

export default function SubjectList({
  subjects = [],
  exam,
  deleteSubject
}) {

  if (!exam) {
    return <p>No exam selected</p>;
  }


  /* =========================
     Filter Subjects by Exam
  ========================= */

  const examSubjects = subjects
    .filter(sub =>
      String(sub.examId) === String(exam._id)
    )
    .map(sub => {

      const weight = calculateSubjectWeight(sub);

      return {
        subject: sub,
        weight
      };

    })
    .sort((a, b) => b.weight - a.weight);


  if (examSubjects.length === 0) {
    return <p>No subjects added yet</p>;
  }


  return (

    <div className="subject-list">

      {examSubjects.map(({ subject, weight }) => {

        const hours = distributeDailyHours(
          subject,
          subjects,
          exam
        );

        return (

          <SubjectCard
            key={subject._id}
            subject={subject}
            examId={exam._id}
            weight={weight}
            hours={hours}
            deleteSubject={deleteSubject}
          />

        );

      })}

    </div>

  );

}
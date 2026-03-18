import SubjectCard from "./SubjectCard";
import { Link } from "react-router-dom";

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
    return (
      <p className="text-gray-500 text-center py-6">
        No exam selected
      </p>
    );
  }

  /* Filter Subjects by Exam */

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


  /*
   * Empty State: No subjects
   */
  if (examSubjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No subjects yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          You haven't added any subjects to this exam yet. Add your first subject to start tracking your progress.
        </p>
        <Link
          to="/setup"
          className="btn-primary py-2.5 px-6 shadow-sm shadow-indigo-200"
        >
          + Add Subject
        </Link>
      </div>
    );
  }


  return (

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

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
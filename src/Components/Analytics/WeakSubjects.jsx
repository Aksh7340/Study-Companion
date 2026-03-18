import { getSubjectProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";

export default function WeakSubjects({ subjects, examId }) {

  const navigate = useNavigate();

  const examSubjects = subjects.filter(
    s => String(s.examId) === String(examId)
  );

  const weakSubjects = examSubjects.filter(
    subject => getSubjectProgress(subject) < 50
  );

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 rounded-full bg-amber-500 inline-block" />
        <h3 className="text-base font-bold text-slate-700">Weak Subjects</h3>
      </div>

      {weakSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-sm font-semibold text-slate-600">No weak subjects!</p>
          <p className="text-xs text-slate-400 mt-1">All subjects are above 50% progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weakSubjects.map(subject => {
            const prog = getSubjectProgress(subject);
            return (
              <div
                key={subject._id}
                onClick={() => navigate(`/dashboard/${examId}/${subject._id}`)}
                className="border border-slate-100 rounded-xl p-3 hover:border-indigo-200
                  hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {subject.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                    {prog}%
                  </span>
                </div>
                <ProgressBar progress={prog} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
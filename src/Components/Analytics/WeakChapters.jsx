import { getChapterProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../UI/ProgressBar";

export default function WeakChapters({ subjects }) {

  const navigate = useNavigate();

  const weakChapters = [];

  subjects.forEach(subject => {
    subject.chapters?.forEach(chapter => {
      const progress = getChapterProgress(chapter);
      if (progress < 50) {
        weakChapters.push({
          examId:      subject.examId,
          subjectId:   subject._id,
          subjectName: subject.name,
          chapter
        });
      }
    });
  });

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 rounded-full bg-red-400 inline-block" />
        <h3 className="text-base font-bold text-slate-700">Weak Chapters</h3>
      </div>

      {weakChapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-sm font-semibold text-slate-600">No weak chapters!</p>
          <p className="text-xs text-slate-400 mt-1">All chapters are above 50% progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weakChapters.map((item, index) => {
            const prog = getChapterProgress(item.chapter);
            return (
              <div
                key={index}
                onClick={() =>
                  navigate(`/dashboard/${item.examId}/${item.subjectId}/${item.chapter._id}`)
                }
                className="border border-slate-100 rounded-xl p-3 hover:border-red-200
                  hover:bg-red-50/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                    {item.chapter.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                    {prog}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">📚 {item.subjectName}</p>
                <ProgressBar progress={prog} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
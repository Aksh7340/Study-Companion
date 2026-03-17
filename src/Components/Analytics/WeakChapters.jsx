import { getChapterProgress } from "../../Logic/studyPlanner";
import { useNavigate } from "react-router-dom";

export default function WeakChapters({ subjects }) {

  const navigate = useNavigate();

  const weakChapters = [];

  subjects.forEach(subject => {

    subject.chapters?.forEach(chapter => {

      const progress = getChapterProgress(chapter);

      if (progress < 50) {

        weakChapters.push({
          subjectId: subject._id,
          subjectName: subject.name,
          chapter
        });

      }

    });

  });

  if (weakChapters.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h3 className="text-lg font-semibold mb-2">
          Weak Chapters
        </h3>

        <p className="text-sm text-gray-500">
          No weak chapters 🎉
        </p>

      </div>
    );
  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

      <h3 className="text-lg font-semibold">
        Weak Chapters
      </h3>

      {weakChapters.map((item, index) => (

        <div
          key={index}
          onClick={() =>
            navigate(`/dashboard/${item.exam}/${item.subjectId}/${item.chapter._id}`)
          }
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
        >

          <p className="font-medium text-gray-800">
            {item.chapter.name}
          </p>

          <p className="text-sm text-gray-500">
            Subject: {item.subjectName}
          </p>

        </div>

      ))}

    </div>

  );

}
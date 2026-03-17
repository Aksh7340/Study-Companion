import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../../Api/api";

import QuestionCard from "./QuestionCard";
import MockResult from "./MockResult";

export default function MockTestPage({ subjects, updateChapter }) {

  const { examId, subjectId, chapterId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const subject = subjects.find(
    s => String(s._id) === String(subjectId)
  );

  const chapter = subject?.chapters?.find(
    c => String(c._id) === String(chapterId)
  );


  /* =============================
     Generate AI Mock Questions
  ============================= */

  useEffect(() => {

    async function generateMock() {

      try {

        const token = localStorage.getItem("token");

        const res = await api.post(
          "/ai/generate-mock",
          {
            chapterName: chapter?.name,
            difficulty: subject?.difficulty
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setQuestions(res.data.questions);

      } catch (error) {

        console.error("Mock generation failed", error);

      } finally {

        setLoading(false);

      }

    }

    if (chapter && subject) {
      generateMock();
    }

  }, [chapter, subject]);


  /* =============================
     Select Answer
  ============================= */

  function selectAnswer(questionId, option) {

    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));

  }


  /* =============================
     Stats
  ============================= */

  const totalQuestions = questions.length;
  const attempted = Object.keys(answers).length;
  const unattempted = totalQuestions - attempted;


  /* =============================
     Submit Test
  ============================= */

  async function submitTest() {

    if (unattempted > 0) {

      const confirmSubmit = window.confirm(
        `${unattempted} questions are unattempted. Submit anyway?`
      );

      if (!confirmSubmit) return;

    }

    let correct = 0;
    let wrong = 0;

    questions.forEach(q => {

      const selected = answers[q.id];

      if (!selected) return;

      if (selected === q.correct) {
        correct++;
      } else {
        wrong++;
      }

    });

    const newResult = {
      correct,
      wrong,
      unattempted,
      score: correct,
      total: totalQuestions
    };

    setResult(newResult);
    setSubmitted(true);


    /* =============================
       Save Mock Test
    ============================= */

    try {

      const token = localStorage.getItem("token");

      const res = await api.post(
        `/subjects/${subjectId}/chapters/${chapterId}/mocktests`,
        {
          score: correct,
          total: totalQuestions
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const savedTest = res.data;

      const updatedChapter = {
        ...chapter,
        mockTests: [...(chapter.mockTests || []), savedTest]
      };

      updateChapter(subjectId, chapterId, updatedChapter);

    } catch (error) {

      console.error("Failed to save mock test", error);

    }

  }


  /* =============================
     Loading
  ============================= */

  if (loading) {

    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-lg font-semibold mb-2">
            Generating Mock Test
          </h2>
          <p className="text-gray-500 text-sm">
            AI is preparing questions...
          </p>
        </div>
      </div>
    );

  }


  /* =============================
     Result Page
  ============================= */

  if (submitted) {

    return (
      <MockResult
        result={result}
        examId={examId}
        subjectId={subjectId}
        chapterId={chapterId}
      />
    );

  }


  /* =============================
     Render Questions
  ============================= */

  return (

    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}

      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h2 className="text-xl font-semibold mb-3">
          Mock Test
        </h2>

        <div className="flex gap-6 text-sm text-gray-600">

          <p>
            Attempted:
            <span className="ml-1 font-medium">
              {attempted}
            </span>
          </p>

          <p>
            Remaining:
            <span className="ml-1 font-medium">
              {unattempted}
            </span>
          </p>

          <p>
            Total:
            <span className="ml-1 font-medium">
              {totalQuestions}
            </span>
          </p>

        </div>

      </div>


      {/* Questions */}

      <div className="space-y-4">

        {questions.map(q => (

          <QuestionCard
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onSelect={selectAnswer}
          />

        ))}

      </div>


      {/* Submit */}

      <div className="flex justify-center">

        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          onClick={submitTest}
        >
          Submit Test
        </button>

      </div>

    </div>

  );

}
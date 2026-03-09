import { useState, useEffect } from "react";


import { useParams } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import MockResult from "./MockResult";

export default function MockTestPage({
  subjects,
  updateChapter
}) {

  const { subjectId, chapterId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const subject = subjects.find(s => s.id === subjectId);
  const chapter = subject?.chapters.find(c => c.id === chapterId);

  useEffect(() => {

    // temporary question generator
    const generated = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: `Sample Question ${i + 1}`,
      options: ["A", "B", "C", "D"],
      correct: "A"
    }));

    setQuestions(generated);

  }, []);

  function selectAnswer(questionId, option) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  }

  const totalQuestions = questions.length;
  const attempted = Object.keys(answers).length;
  const unattempted = totalQuestions - attempted;

  function submitTest() {

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

    const newTest = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: correct,
      total: totalQuestions
    };

    const updatedChapter = {
      ...chapter,
      mockTests: [...chapter.mockTests, newTest]
    };

    updateChapter(subjectId, updatedChapter);
  }

  if (submitted) {
    return <MockResult result={result} />;
  }

  return (
    <div className="section">

      <h2>Mock Test</h2>

      <p>
        Attempted: {attempted} / {totalQuestions}
      </p>

      <p>
        Remaining: {unattempted}
      </p>

      {questions.map(q => (
        <QuestionCard
          key={q.id}
          question={q}
          selected={answers[q.id]}
          onSelect={selectAnswer}
        />
      ))}

      <button
        className="button"
        onClick={submitTest}
      >
        Submit Test
      </button>

    </div>
  );
}
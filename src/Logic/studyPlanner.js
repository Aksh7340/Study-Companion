export function remainingDays(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return Math.ceil(
    (targetDate - today) / (1000 * 60 * 60 * 24)
  );
}

export function getDifficultyWeight(subject){
    if(subject.difficilty=="Easy"){
        return 1
    }
    else if(subject.difficilty=="Medium"){
      return 2
    }
    else{
        return 3
    }
  
}

export function calculateSubjectWeight(subject){
    const difficiltyWeight=getDifficultyWeight(subject)
    return difficiltyWeight*subject.chapters;
}

export function getTotalWeight(subjects, examId) {
  return subjects
    .filter(subject => subject.examId === examId)
    .reduce((total, subject) => {
      return total + calculateSubjectWeight(subject);
    }, 0);
}

export function distributeDailyHours(subject, subjects, exam) {
  const totalWeight = getTotalWeight(subjects, exam.examId);
  const subjectWeight = calculateSubjectWeight(subject);

  if (totalWeight === 0) return 0;

  const ratio = subjectWeight / totalWeight;

  return  exam.studyHours * ratio .toFixed(2);
}

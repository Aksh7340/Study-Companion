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
    if(subject.difficulty=="Easy"){
        return 1
    }
    else if(subject.difficulty=="Medium"){
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
  if (totalWeight === 0 || exam.studyHours === 0) {
    return "0 h 0 min";
  }

  // 1. Convert total study time to minutes
  const totalMinutes = exam.studyHours * 60;

  // 2. Calculate raw minutes for this subject
  const subjectWeight = calculateSubjectWeight(subject);
  const rawMinutes = totalMinutes * (subjectWeight / totalWeight);

  // 3. Floor to avoid overflow
  const finalMinutes = Math.floor(rawMinutes);

  // 4. Convert minutes → hours + minutes
  const hours = Math.trunc(finalMinutes / 60);
  const minutes = finalMinutes % 60;

  return `${hours} h ${minutes} min`;
}

export function examPriority(){
  
}

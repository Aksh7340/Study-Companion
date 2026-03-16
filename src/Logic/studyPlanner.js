// ================================
// Date Logic
// ================================

export function remainingDays(date){

  if(!date) return 0;

  const today = new Date();
  today.setHours(0,0,0,0);

  const targetDate = new Date(date);
  targetDate.setHours(0,0,0,0);

  return Math.ceil(
    (targetDate - today) / (1000 * 60 * 60 * 24)
  );

}


// ================================
// Subject Difficulty Logic
// ================================

export function getDifficultyWeight(subject){

  if(subject?.difficulty === "Easy") return 1;
  if(subject?.difficulty === "Medium") return 2;

  return 3;

}


export function calculateSubjectWeight(subject){

  const weight = getDifficultyWeight(subject);

  const chapters = subject?.chapters || [];

  return weight * chapters.length;

}


// ================================
// Chapter Analytics
// ================================

export function getChapterTestsTaken(chapter){

  const tests = chapter?.mockTests || [];

  return tests.length;

}


export function getChapterAverageScore(chapter){

  const tests = chapter?.mockTests || [];

  if(tests.length === 0) return 0;

  const totalScore =
    tests.reduce((sum,t) => sum + (t.score || 0) ,0);

  return totalScore / tests.length;

}


export function getChapterBestScore(chapter){

  const tests = chapter?.mockTests || [];

  if(tests.length === 0) return null;

  return Math.max(...tests.map(t => t.score || 0));

}


// Progress based on percentage score
export function getChapterProgress(chapter){

  const tests = chapter?.mockTests || [];

  if(tests.length === 0) return 0;

  const totalScore =
    tests.reduce((sum,t) => sum + (t.score || 0),0);

  const totalPossible =
    tests.reduce((sum,t) => sum + (t.total || 0),0);

  if(totalPossible === 0) return 0;

  const percent =
    (totalScore / totalPossible) * 100;

  return Math.round(percent);

}


// Status derived from progress
export function getChapterStatus(chapter){

  const progress = getChapterProgress(chapter);

  if(progress === 0) return "Not Started";

  if(progress < 80) return "In Progress";

  return "Completed";

}


// ================================
// Subject Progress
// ================================

export function getSubjectProgress(subject){

  const chapters = subject?.chapters || [];

  if(chapters.length === 0) return 0;

  const total =
    chapters.reduce(
      (sum,ch) => sum + getChapterProgress(ch),
      0
    );

  return Math.round(total / chapters.length);

}


// ================================
// Exam Progress
// ================================

export function getExamProgress(examId, subjects){

  const examSubjects =
    subjects.filter(
      s => String(s.examId) === String(examId)
    );

  if(examSubjects.length === 0) return 0;

  const total =
    examSubjects.reduce(
      (sum,s) => sum + getSubjectProgress(s),
      0
    );

  return Math.round(total / examSubjects.length);

}

// ================================
// Exam Status
// ================================

export function getExamStatus(exam, subjects){

  const progress = getExamProgress(exam._id, subjects);

  const today = new Date();
  const examDate = new Date(exam.date);

  const diffTime = examDate - today;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  /* =========================
     Past Exam
  ========================= */

  if (examDate < today){

    if(progress >= 90){
      return "Completed";
    }

    return "Incomplete";
  }

  /* =========================
     Future Exam
  ========================= */

  if(progress >= 90){
    return "Ready";
  }

  if(days <= 7){
    return "Urgent";
  }

  if(days <= 20){
    return "Upcoming";
  }

  return "In Progress";
}


// ================================
// Study Planner
// ================================

export function getTotalWeight(subjects, examId){

  return subjects
    .filter(
      subject => String(subject.examId) === String(examId)
    )
    .reduce(
      (total,subject)=>
        total + calculateSubjectWeight(subject),
      0
    );

}


export function distributeDailyHours(subject, subjects, exam){

  if(!exam) return "0 h 0 min";

  const totalWeight =
    getTotalWeight(subjects, exam._id);

  if(totalWeight === 0 || !exam.studyHours){
    return "0 h 0 min";
  }

  const totalMinutes = exam.studyHours * 60;

  const subjectWeight =
    calculateSubjectWeight(subject);

  const rawMinutes =
    totalMinutes * (subjectWeight / totalWeight);

  const finalMinutes = Math.floor(rawMinutes);

  const hours = Math.trunc(finalMinutes / 60);

  const minutes = finalMinutes % 60;

  return `${hours} h ${minutes} min`;

}
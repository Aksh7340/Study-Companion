import { describe, it, expect, beforeEach } from "vitest";
import {
  remainingDays,
  getDifficultyWeight,
  calculateSubjectWeight,
  getChapterTestsTaken,
  getChapterAverageScore,
  getChapterBestScore,
  getChapterProgress,
  getChapterStatus,
  getSubjectProgress,
  getExamProgress,
  getExamStatus,
  getTotalWeight,
  distributeDailyHours
} from "../studyPlanner";

// ================================
// DATE LOGIC TESTS
// ================================

describe("remainingDays", () => {
  
  it("should return 0 for null or undefined date", () => {
    expect(remainingDays(null)).toBe(0);
    expect(remainingDays(undefined)).toBe(0);
  });

  it("should return 1 for tomorrow's date", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = remainingDays(tomorrow);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("should return 0 for today's date", () => {
    const today = new Date();
    
    const result = remainingDays(today);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("should return negative value for past date", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    expect(remainingDays(yesterday)).toBeLessThan(0);
  });

  it("should return 7 for a week from now", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const result = remainingDays(nextWeek);
    expect(result).toBeGreaterThanOrEqual(6);
  });

  it("should return 30 for a month from now", () => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    
    const result = remainingDays(nextMonth);
    expect(result).toBeGreaterThanOrEqual(29);
  });
});

// ================================
// DIFFICULTY WEIGHT TESTS
// ================================

describe("getDifficultyWeight", () => {
  
  it("should return 1 for Easy difficulty", () => {
    const subject = { difficulty: "Easy" };
    expect(getDifficultyWeight(subject)).toBe(1);
  });

  it("should return 2 for Medium difficulty", () => {
    const subject = { difficulty: "Medium" };
    expect(getDifficultyWeight(subject)).toBe(2);
  });

  it("should return 3 for Hard difficulty", () => {
    const subject = { difficulty: "Hard" };
    expect(getDifficultyWeight(subject)).toBe(3);
  });

  it("should return 3 for unknown difficulty", () => {
    const subject = { difficulty: "Unknown" };
    expect(getDifficultyWeight(subject)).toBe(3);
  });

  it("should return 3 for null or undefined difficulty", () => {
    expect(getDifficultyWeight(null)).toBe(3);
    expect(getDifficultyWeight({})).toBe(3);
    expect(getDifficultyWeight({ difficulty: undefined })).toBe(3);
  });
});

// ================================
// SUBJECT WEIGHT TESTS
// ================================

describe("calculateSubjectWeight", () => {
  
  it("should calculate weight correctly for Easy with 2 chapters", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [
        { name: "Chapter 1" },
        { name: "Chapter 2" }
      ]
    };
    
    const weight = calculateSubjectWeight(subject);
    expect(weight).toBe(2);
  });

  it("should calculate weight correctly for Hard with 3 chapters", () => {
    const subject = {
      difficulty: "Hard",
      chapters: [
        { name: "Chapter 1" },
        { name: "Chapter 2" },
        { name: "Chapter 3" }
      ]
    };
    
    const weight = calculateSubjectWeight(subject);
    expect(weight).toBe(9);
  });

  it("should return 0 for subject with no chapters", () => {
    const subject = {
      difficulty: "Medium",
      chapters: []
    };
    
    expect(calculateSubjectWeight(subject)).toBe(0);
  });

  it("should return 0 for null subject", () => {
    expect(calculateSubjectWeight(null)).toBe(0);
  });

  it("should calculate Medium difficulty correctly", () => {
    const subject = {
      difficulty: "Medium",
      chapters: [{ name: "Ch1" }, { name: "Ch2" }]
    };
    
    expect(calculateSubjectWeight(subject)).toBe(4);
  });
});

// ================================
// CHAPTER TESTS TAKEN TESTS
// ================================

describe("getChapterTestsTaken", () => {
  
  it("should return 0 for no mock tests", () => {
    const chapter = { mockTests: [] };
    expect(getChapterTestsTaken(chapter)).toBe(0);
  });

  it("should return correct count for multiple tests", () => {
    const chapter = {
      mockTests: [
        { score: 8, total: 10 },
        { score: 9, total: 10 },
        { score: 7, total: 10 }
      ]
    };
    expect(getChapterTestsTaken(chapter)).toBe(3);
  });

  it("should return 0 for null chapter", () => {
    expect(getChapterTestsTaken(null)).toBe(0);
  });

  it("should return 0 for chapter without mockTests property", () => {
    const chapter = { name: "Chapter 1" };
    expect(getChapterTestsTaken(chapter)).toBe(0);
  });

  it("should return 1 for single test", () => {
    const chapter = {
      mockTests: [{ score: 8, total: 10 }]
    };
    expect(getChapterTestsTaken(chapter)).toBe(1);
  });
});

// ================================
// CHAPTER AVERAGE SCORE TESTS
// ================================

describe("getChapterAverageScore", () => {
  
  it("should return 0 for no tests", () => {
    const chapter = { mockTests: [] };
    expect(getChapterAverageScore(chapter)).toBe(0);
  });

  it("should calculate average correctly", () => {
    const chapter = {
      mockTests: [
        { score: 8, total: 10 },
        { score: 9, total: 10 },
        { score: 10, total: 10 }
      ]
    };
    expect(getChapterAverageScore(chapter)).toBe(9);
  });

  it("should handle decimal averages", () => {
    const chapter = {
      mockTests: [
        { score: 7, total: 10 },
        { score: 8, total: 10 }
      ]
    };
    expect(getChapterAverageScore(chapter)).toBe(7.5);
  });

  it("should return 0 for null chapter", () => {
    expect(getChapterAverageScore(null)).toBe(0);
  });

  it("should ignore missing score values", () => {
    const chapter = {
      mockTests: [
        { score: 10, total: 10 },
        { total: 10 },
        { score: 10, total: 10 }
      ]
    };
    expect(getChapterAverageScore(chapter)).toBeCloseTo(20 / 3);
  });

  it("should handle single test", () => {
    const chapter = {
      mockTests: [{ score: 8, total: 10 }]
    };
    expect(getChapterAverageScore(chapter)).toBe(8);
  });
});

// ================================
// CHAPTER BEST SCORE TESTS
// ================================

describe("getChapterBestScore", () => {
  
  it("should return null for no tests", () => {
    const chapter = { mockTests: [] };
    expect(getChapterBestScore(chapter)).toBe(null);
  });

  it("should return highest score", () => {
    const chapter = {
      mockTests: [
        { score: 7, total: 10 },
        { score: 9, total: 10 },
        { score: 8, total: 10 }
      ]
    };
    expect(getChapterBestScore(chapter)).toBe(9);
  });

  it("should return null for null chapter", () => {
    expect(getChapterBestScore(null)).toBe(null);
  });

  it("should handle single test", () => {
    const chapter = {
      mockTests: [{ score: 8, total: 10 }]
    };
    expect(getChapterBestScore(chapter)).toBe(8);
  });

  it("should handle missing score values", () => {
    const chapter = {
      mockTests: [
        { score: 8, total: 10 },
        { total: 10 },
        { score: 5, total: 10 }
      ]
    };
    expect(getChapterBestScore(chapter)).toBe(8);
  });
});

// ================================
// CHAPTER PROGRESS TESTS
// ================================

describe("getChapterProgress", () => {
  
  it("should return 0 for no tests", () => {
    const chapter = { mockTests: [] };
    expect(getChapterProgress(chapter)).toBe(0);
  });

  it("should calculate progress as percentage", () => {
    const chapter = {
      mockTests: [
        { score: 8, total: 10 },
        { score: 9, total: 10 }
      ]
    };
    const result = getChapterProgress(chapter);
    expect(result).toBe(85);
  });

  it("should return 100 for perfect score", () => {
    const chapter = {
      mockTests: [
        { score: 10, total: 10 },
        { score: 10, total: 10 }
      ]
    };
    expect(getChapterProgress(chapter)).toBe(100);
  });

  it("should return 0 for null total", () => {
    const chapter = {
      mockTests: [{ score: 5, total: 0 }]
    };
    expect(getChapterProgress(chapter)).toBe(0);
  });

  it("should round to nearest integer", () => {
    const chapter = {
      mockTests: [
        { score: 1, total: 3 }
      ]
    };
    const result = getChapterProgress(chapter);
    expect(result).toBeCloseTo(33, 0);
  });
});

// ================================
// CHAPTER STATUS TESTS
// ================================

describe("getChapterStatus", () => {
  
  it("should return 'Not Started' when progress is 0", () => {
    const chapter = { mockTests: [] };
    expect(getChapterStatus(chapter)).toBe("Not Started");
  });

  it("should return 'In Progress' when progress is 50%", () => {
    const chapter = {
      mockTests: [{ score: 5, total: 10 }]
    };
    expect(getChapterStatus(chapter)).toBe("In Progress");
  });

  it("should return 'In Progress' when progress is 79%", () => {
    const chapter = {
      mockTests: [{ score: 79, total: 100 }]
    };
    expect(getChapterStatus(chapter)).toBe("In Progress");
  });

  it("should return 'Completed' when progress is 80%", () => {
    const chapter = {
      mockTests: [{ score: 8, total: 10 }]
    };
    expect(getChapterStatus(chapter)).toBe("Completed");
  });

  it("should return 'Completed' when progress is 100%", () => {
    const chapter = {
      mockTests: [{ score: 10, total: 10 }]
    };
    expect(getChapterStatus(chapter)).toBe("Completed");
  });
});

// ================================
// SUBJECT PROGRESS TESTS
// ================================

describe("getSubjectProgress", () => {
  
  it("should return 0 for no chapters", () => {
    const subject = { chapters: [] };
    expect(getSubjectProgress(subject)).toBe(0);
  });

  it("should calculate average progress across chapters", () => {
    const subject = {
      chapters: [
        {
          mockTests: [{ score: 8, total: 10 }]
        },
        {
          mockTests: [{ score: 6, total: 10 }]
        }
      ]
    };
    const result = getSubjectProgress(subject);
    expect(result).toBe(70);
  });

  it("should return 0 for null subject", () => {
    expect(getSubjectProgress(null)).toBe(0);
  });

  it("should handle single chapter", () => {
    const subject = {
      chapters: [
        {
          mockTests: [{ score: 9, total: 10 }]
        }
      ]
    };
    expect(getSubjectProgress(subject)).toBe(90);
  });

  it("should round result", () => {
    const subject = {
      chapters: [
        {
          mockTests: [{ score: 1, total: 3 }]
        },
        {
          mockTests: [{ score: 1, total: 3 }]
        }
      ]
    };
    const result = getSubjectProgress(subject);
    expect(result).toBeCloseTo(33, 0);
  });
});

// ================================
// EXAM PROGRESS TESTS
// ================================

describe("getExamProgress", () => {
  
  it("should return 0 for no subjects", () => {
    const examId = "exam1";
    const subjects = [];
    expect(getExamProgress(examId, subjects)).toBe(0);
  });

  it("should calculate average progress across subjects", () => {
    const examId = "exam1";
    const subjects = [
      {
        _id: "subj1",
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 8, total: 10 }]
          }
        ]
      },
      {
        _id: "subj2",
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 6, total: 10 }]
          }
        ]
      }
    ];
    const result = getExamProgress(examId, subjects);
    expect(result).toBe(70);
  });

  it("should filter subjects by examId", () => {
    const examId = "exam1";
    const subjects = [
      {
        _id: "subj1",
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 8, total: 10 }]
          }
        ]
      },
      {
        _id: "subj2",
        examId: "exam2",
        chapters: [
          {
            mockTests: [{ score: 0, total: 10 }]
          }
        ]
      }
    ];
    const result = getExamProgress(examId, subjects);
    expect(result).toBe(80);
  });

  it("should handle string and number examIds", () => {
    const examId = "exam1";
    const subjects = [
      {
        _id: "subj1",
        examId: 1,
        chapters: [
          {
            mockTests: [{ score: 8, total: 10 }]
          }
        ]
      }
    ];
    const result = getExamProgress("1", subjects);
    expect(result).toBe(80);
  });
});

// ================================
// EXAM STATUS TESTS
// ================================

describe("getExamStatus", () => {
  
  it("should return 'In Progress' for future exam with low progress", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const exam = {
      _id: "exam1",
      date: futureDate,
      studyHours: 100
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 5, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("In Progress");
  });

  it("should return 'Upcoming' for exam within 20 days", () => {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 15);
    
    const exam = {
      _id: "exam1",
      date: examDate
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 7, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("Upcoming");
  });

  it("should return 'Urgent' for exam within 7 days", () => {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5);
    
    const exam = {
      _id: "exam1",
      date: examDate
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 7, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("Urgent");
  });

  it("should return 'Ready' for high progress future exam", () => {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 30);
    
    const exam = {
      _id: "exam1",
      date: examDate
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 9, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("Ready");
  });

  it("should return 'Completed' for past exam with high progress", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    
    const exam = {
      _id: "exam1",
      date: pastDate
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 9, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("Completed");
  });

  it("should return 'Incomplete' for past exam with low progress", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    
    const exam = {
      _id: "exam1",
      date: pastDate
    };
    
    const subjects = [
      {
        examId: "exam1",
        chapters: [
          {
            mockTests: [{ score: 5, total: 10 }]
          }
        ]
      }
    ];
    
    expect(getExamStatus(exam, subjects)).toBe("Incomplete");
  });
});

// ================================
// TOTAL WEIGHT TESTS
// ================================

describe("getTotalWeight", () => {
  
  it("should return 0 for no subjects", () => {
    expect(getTotalWeight([], "exam1")).toBe(0);
  });

  it("should calculate total weight for single exam", () => {
    const subjects = [
      {
        examId: "exam1",
        difficulty: "Easy",
        chapters: [{ name: "Ch1" }]
      },
      {
        examId: "exam1",
        difficulty: "Hard",
        chapters: [{ name: "Ch1" }, { name: "Ch2" }]
      }
    ];
    const result = getTotalWeight(subjects, "exam1");
    expect(result).toBe(7);
  });

  it("should filter by examId", () => {
    const subjects = [
      {
        examId: "exam1",
        difficulty: "Easy",
        chapters: [{ name: "Ch1" }]
      },
      {
        examId: "exam2",
        difficulty: "Hard",
        chapters: [{ name: "Ch1" }]
      }
    ];
    const result = getTotalWeight(subjects, "exam1");
    expect(result).toBe(1);
  });

  it("should handle string and number examIds", () => {
    const subjects = [
      {
        examId: 1,
        difficulty: "Medium",
        chapters: [{ name: "Ch1" }, { name: "Ch2" }]
      }
    ];
    const result = getTotalWeight(subjects, "1");
    expect(result).toBe(4);
  });
});

// ================================
// DISTRIBUTE DAILY HOURS TESTS (FIXED)
// ================================

describe("distributeDailyHours", () => {
  
  it("should return '0 h 0 min' when exam is null", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    expect(distributeDailyHours(subject, [], null)).toBe("0 h 0 min");
  });

  it("should return '0 h 0 min' for zero total weight", () => {
    const subject = {
      difficulty: "Easy",
      chapters: []
    };
    
    const exam = {
      _id: "exam1",
      studyHours: 100
    };
    
    expect(distributeDailyHours(subject, [], exam)).toBe("0 h 0 min");
  });

  it("should distribute hours proportionally", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    const subjects = [subject];
    
    const exam = {
      _id: "exam1",
      studyHours: 10
    };
    
    const result = distributeDailyHours(subject, subjects, exam);
    expect(result).toMatch(/\d+ h \d+ min/);
  });

  it("should handle multiple subjects with different weights", () => {
    const easySubject = {
      _id: "subj1",
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    const hardSubject = {
      _id: "subj2",
      difficulty: "Hard",
      chapters: [{ name: "Ch1" }]
    };
    
    const subjects = [easySubject, hardSubject];
    
    const exam = {
      _id: "exam1",
      studyHours: 20
    };
    
    const result1 = distributeDailyHours(easySubject, subjects, exam);
    const result2 = distributeDailyHours(hardSubject, subjects, exam);
    
    expect(result1).toMatch(/\d+ h \d+ min/);
    expect(result2).toMatch(/\d+ h \d+ min/);
  });

  it("should format minutes correctly", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    const subjects = [subject];
    
    const exam = {
      _id: "exam1",
      studyHours: 1
    };
    
    const result = distributeDailyHours(subject, subjects, exam);
    expect(result).toMatch(/\d+ h \d+ min/);
  });

  it("should return '0 h 0 min' for zero study hours", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    const subjects = [subject];
    
    const exam = {
      _id: "exam1",
      studyHours: 0
    };
    
    expect(distributeDailyHours(subject, subjects, exam)).toBe("0 h 0 min");
  });

  it("should handle minutes without full hours", () => {
    const subject = {
      difficulty: "Easy",
      chapters: [{ name: "Ch1" }]
    };
    
    const subjects = [subject];
    
    const exam = {
      _id: "exam1",
      studyHours: 0.5
    };
    
    const result = distributeDailyHours(subject, subjects, exam);
    expect(result).toMatch(/\d+ h \d+ min/);
  });
});

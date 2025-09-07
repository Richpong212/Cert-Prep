import { PracticeConfig } from "@/types";

export interface PracticeExam {
  id: string;
  trackId: string;
  title: string;
  description: string;
  config: PracticeConfig;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const practiceExams: PracticeExam[] = [
  // Cloud Practitioner Final Exams
  {
    id: "cp-exam-1",
    trackId: "aws-cp",
    title: "Cloud Practitioner Final Exam 1",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "cp-exam-2", 
    trackId: "aws-cp",
    title: "Cloud Practitioner Final Exam 2",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "cp-exam-3",
    trackId: "aws-cp", 
    title: "Cloud Practitioner Final Exam 3",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "cp-exam-4",
    trackId: "aws-cp",
    title: "Cloud Practitioner Final Exam 4",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "cp-exam-5",
    trackId: "aws-cp",
    title: "Cloud Practitioner Final Exam 5",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "cp-exam-6",
    trackId: "aws-cp",
    title: "Cloud Practitioner Final Exam 6",
    description: "Comprehensive AWS Cloud Practitioner certification practice exam",
    difficulty: "intermediate",
    config: {
      trackId: "aws-cp",
      domains: ["Cloud Concepts", "AWS Services", "Security & Compliance", "Billing & Pricing"],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },

  // Solutions Architect Associate Final Exams
  {
    id: "saa-exam-1",
    trackId: "aws-saa",
    title: "Solutions Architect Final Exam 1",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "saa-exam-2",
    trackId: "aws-saa", 
    title: "Solutions Architect Final Exam 2",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "saa-exam-3",
    trackId: "aws-saa",
    title: "Solutions Architect Final Exam 3",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "saa-exam-4",
    trackId: "aws-saa",
    title: "Solutions Architect Final Exam 4",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "saa-exam-5",
    trackId: "aws-saa",
    title: "Solutions Architect Final Exam 5",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  },
  {
    id: "saa-exam-6",
    trackId: "aws-saa",
    title: "Solutions Architect Final Exam 6",
    description: "Comprehensive AWS Solutions Architect Associate certification practice exam",
    difficulty: "advanced",
    config: {
      trackId: "aws-saa",
      domains: [
        "Design Resilient Architectures",
        "Design High-Performing Architectures",
        "Design Secure Applications and Architectures",
        "Design Cost-Optimized Architectures"
      ],
      difficulty: ["easy", "medium", "hard"],
      count: 65,
      mode: "timed",
      reveal: "end"
    }
  }
];

export const getPracticeExamsByTrackId = (trackId: string): PracticeExam[] => {
  return practiceExams.filter(exam => exam.trackId === trackId);
};

export const getPracticeExamById = (examId: string): PracticeExam | undefined => {
  return practiceExams.find(exam => exam.id === examId);
};
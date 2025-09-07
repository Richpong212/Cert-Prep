export type TrackId = "aws-cp" | "aws-saa" | "aws-devops" | "k8s-cka";

export type Question = {
  id: string;
  trackId: TrackId;
  domain: string;
  difficulty: "easy" | "medium" | "hard";
  stemMd: string;
  choices: { id: string; textMd: string }[];
  correctChoiceIds: string[];
  explanationMd: string;
  tags?: string[];
  references?: { label: string; url: string }[];
};

export type PracticeConfig = {
  trackId: TrackId;
  domains?: string[];
  difficulty?: ("easy" | "medium" | "hard")[];
  count: number;
  mode: "timed" | "untimed";
  reveal: "after-each" | "end" | "off";
};

export type Answer = {
  questionId: string;
  selectedChoiceIds: string[];
  flagged?: boolean;
  answeredAt?: string;
};

export type Session = {
  id: string;
  type: "practice" | "exam";
  config: PracticeConfig;
  questionIds: string[];
  startedAt: string;
  endedAt?: string;
  timeLimitSec?: number;
  answers: Record<string, Answer>;
};

export type ResultSummary = {
  sessionId: string;
  scorePct: number;
  total: number;
  correct: number;
  timeTakenSec: number;
  byDomain: { domain: string; correct: number; total: number }[];
};

export type Track = {
  id: TrackId;
  name: string;
  description: string;
  domains: string[];
  questionCounts: Record<string, number>;
  examInfo: {
    duration: number; // minutes
    totalQuestions: number;
    passingScore: number; // percentage
  };
};
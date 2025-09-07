import { User } from "@/hooks/useAuth";

export interface TierLimits {
  dailyQuestions: number;
  tracksAccess: string[];
  examSimulator: boolean;
  analytics: boolean;
  explanations: boolean;
  customPractice: boolean;
  priority: number;
}

export const TIER_LIMITS: Record<User['subscription'], TierLimits> = {
  guest: {
    dailyQuestions: 5,
    tracksAccess: ['aws-cp'],
    examSimulator: false,
    analytics: false,
    explanations: false,
    customPractice: false,
    priority: 0
  },
  free: {
    dailyQuestions: 20,
    tracksAccess: ['aws-cp', 'aws-saa'],
    examSimulator: false,
    analytics: true,
    explanations: true,
    customPractice: true,
    priority: 1
  },
  pro: {
    dailyQuestions: 100,
    tracksAccess: ['aws-cp', 'aws-saa', 'aws-devops'],
    examSimulator: true,
    analytics: true,
    explanations: true,
    customPractice: true,
    priority: 2
  },
  lifetime: {
    dailyQuestions: -1, // unlimited
    tracksAccess: ['aws-cp', 'aws-saa', 'aws-devops', 'k8s-cka'],
    examSimulator: true,
    analytics: true,
    explanations: true,
    customPractice: true,
    priority: 3
  }
};

export const getUserLimits = (user: User | null): TierLimits => {
  if (!user) return TIER_LIMITS.guest;
  return TIER_LIMITS[user.subscription];
};

export const canAccessTrack = (user: User | null, trackId: string): boolean => {
  const limits = getUserLimits(user);
  return limits.tracksAccess.includes(trackId);
};

export const getRemainingQuestions = (user: User | null): number => {
  if (!user) return TIER_LIMITS.guest.dailyQuestions;
  
  const limits = getUserLimits(user);
  if (limits.dailyQuestions === -1) return -1; // unlimited
  
  const used = user.questionsToday || 0;
  return Math.max(0, limits.dailyQuestions - used);
};
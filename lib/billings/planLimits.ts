export const PLAN_LIMITS = {
  FREE: {
    aiRequestsPerDay: 3,
    aiRequestsPerMonth: 20,
  },
  PRO: {
    aiRequestsPerDay: 3,
    aiRequestsPerMonth: 1000,
  },
  PREMIUM: {
    aiRequestsPerDay: Infinity,
    aiRequestsPerMonth: Infinity,
  },
} as const;

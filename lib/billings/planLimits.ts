import { PlanType } from "@/types/database/user/UserPlan";

export const PLAN_LIMITS: Record<
  PlanType,
  {
    aiRequestsPerDay: number;
    aiRequestsPerMonth: number;
  }
> = {
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

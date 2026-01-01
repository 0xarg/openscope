import { PlanType } from "@/types/database/user/UserPlan";

export const PLAN_LIMITS: Record<
  PlanType,
  {
    aiRequestsPerDay: number;
    aiRequestsPerMonth: number;
  }
> = {
  FREE: {
    aiRequestsPerDay: 10,
    aiRequestsPerMonth: 50,
  },
  PRO: {
    aiRequestsPerDay: 50,
    aiRequestsPerMonth: 1000,
  },
  PREMIUM: {
    aiRequestsPerDay: Infinity,
    aiRequestsPerMonth: Infinity,
  },
} as const;

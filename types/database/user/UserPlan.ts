export type PlanType = "FREE" | "PRO" | "PREMIUM";

export interface UserPlan {
  id: number;
  userId: number;

  plan: PlanType;
  startedAt: Date;
  endsAt?: Date | null;
  isActive: boolean;

  // Stripe (optional but future-safe)
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

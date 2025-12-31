export interface UserUsage {
  id: number;
  userId: number;

  // Tracking usage
  trackedIssuesCount: number;
  trackedReposCount: number;

  // AI usage
  aiRequestsToday: number;
  aiRequestsMonth: number;

  // Token-level accounting (future)
  aiTokensToday: number;
  aiTokensMonth: number;

  // Reset timestamps
  lastDailyReset: Date;
  lastMonthlyReset: Date;
}

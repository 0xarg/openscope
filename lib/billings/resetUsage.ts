export function shouldResetDaily(lastReset: Date) {
  const now = new Date();
  return now.toDateString() !== lastReset.toDateString();
}

export function shouldResetMonthly(lastReset: Date) {
  const now = new Date();
  return (
    now.getFullYear() !== lastReset.getFullYear() ||
    now.getMonth() !== lastReset.getMonth()
  );
}

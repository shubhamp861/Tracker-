export interface DaysLeftInfo {
  days: number;
  text: string;
  isPast: boolean;
  isToday: boolean;
}

export function getDaysLeft(releaseDateStr?: string): DaysLeftInfo | null {
  if (!releaseDateStr) return null;
  const target = new Date(releaseDateStr);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffMs = targetMidnight - nowMidnight;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, text: 'Releasing Today!', isPast: false, isToday: true };
  } else if (diffDays === 1) {
    return { days: 1, text: '1 day left (Tomorrow)', isPast: false, isToday: false };
  } else if (diffDays > 1) {
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      const approx = months > 0 ? ` (~${years}y ${months}m)` : ` (~${years}y)`;
      return {
        days: diffDays,
        text: `${diffDays} days left${approx}`,
        isPast: false,
        isToday: false,
      };
    }
    return { days: diffDays, text: `${diffDays} days left`, isPast: false, isToday: false };
  } else {
    return {
      days: diffDays,
      text: `Released (${Math.abs(diffDays)} days ago)`,
      isPast: true,
      isToday: false,
    };
  }
}

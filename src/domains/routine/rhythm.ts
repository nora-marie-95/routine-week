import type { Rhythm } from "@/domains/routine/types";

export const DEFAULT_TIMES_PER_WEEK = 3;

export const formatRhythm = (rhythm: Rhythm) => {
  switch (rhythm.kind) {
    case "daily": {
      return "Daily";
    }
    case "weekly": {
      return "Weekly";
    }
    case "biweekly": {
      return "Every 2 weeks";
    }
    case "monthly": {
      return "Monthly";
    }
    case "timesPerWeek": {
      return `${rhythm.times}× a week`;
    }
  }
};

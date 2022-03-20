import * as R from "ramda";
import Answer, {isAnswerCorrect} from "./answer";

// Constants and functions used in score and streak calculations
export const scorePerStreak = 1000;
export const allCorrectAchievementScore = 500;
export const streakThresholds = [3];
export const streakModulus = 5;

export function computeStreak(answers: Answer[]): number {
  return R.length(R.takeLastWhile(isAnswerCorrect, answers));
}

export function isStreakAtThreshold(streak: number): boolean {
  return streak > 1 && (R.includes(streak, streakThresholds) || streak % streakModulus === 0);
}

export function computeStreaks(answers: Answer[]): number[] {
  return R.reduce((acc, value) =>
      isAnswerCorrect(value)
        ? R.append(R.last(acc)! + 1, R.init(acc)) // Add 1 to the last streak already in the array
        : R.append(0, acc) // Create a new streak initialised to 0
    , [0], answers);
}

export function computeBaseScore(time: number): number {
  return 1000000 / time;
}

export function computeTotalBaseScore(times: number[]): number {
  return R.sum(R.map(computeBaseScore, times));
}

export function computeStreakScore(streak: number): number {
  let thresholdsExceeded = 0;
  thresholdsExceeded += R.length(R.filter(streakThreshold => streak >= streakThreshold, streakThresholds));
  thresholdsExceeded += Math.floor(streak / streakModulus);

  return thresholdsExceeded * scorePerStreak;
}

export function computeTotalStreakScore(streaks: number[]): number {
  return R.sum(R.map(computeStreakScore, streaks));
}

export function isAllCorrectAchievement(answers: Answer[]): boolean {
  return R.length(answers) >= 3 && R.all(isAnswerCorrect, answers);
}

export function computeAllCorrectAchievementBonus(answers: Answer[]): number {
  return isAllCorrectAchievement(answers) ? allCorrectAchievementScore * R.length(answers) : 0;
}

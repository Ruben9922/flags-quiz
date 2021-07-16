import * as R from "ramda";
import {isAnswerCorrect} from "./utilities";

// Constants and functions used in score and streak calculations
export const scorePerStreak = 1000;
export const streakThresholds = [3];
export const streakModulus = 5;

export function computeStreak(answers) {
  return R.length(R.takeLastWhile(isAnswerCorrect, answers));
}

export function isStreakAtThreshold(streak) {
  return streak > 1 && (R.includes(streak, streakThresholds) || streak % streakModulus === 0);
}

export function computeStreaks(answers) {
  return R.reduce((acc, value) =>
      isAnswerCorrect(value)
        ? R.append(R.last(acc) + 1, R.init(acc)) // Add 1 to the last streak already in the array
        : R.append(0, acc) // Create a new streak initialised to 0
    , [0], answers);
}

export function computeBaseScore(time) {
  return 1000000 / time;
}

export function computeTotalBaseScore(times) {
  return R.sum(R.map(computeBaseScore, times));
}

export function computeStreakScore(streak) {
  let thresholdsExceeded = 0;
  thresholdsExceeded += R.length(R.filter(streakThreshold => streak >= streakThreshold, streakThresholds));
  thresholdsExceeded += Math.floor(streak / streakModulus);

  return thresholdsExceeded * scorePerStreak;
}

export function computeTotalStreakScore(streaks) {
  return R.sum(R.map(computeStreakScore, streaks));
}

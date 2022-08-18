import * as R from "ramda";
import Answer, {isAnswerCorrect} from "./answer";
import Mode from "./mode";
import {InputMode} from "./utilities";

interface Scores {
  streaks: number[];
  totalBaseScore: number;
  totalStreakScore: number;
  allCorrectAchievementBonus: number;
  totalScore: number;
}

// Constants and functions used in score and streak calculations
export const scorePerStreak = 1000;
export const allCorrectAchievementScore = 500;
export const streakThresholds = [3];
export const streakModulus = 5;

export function computeStreak(answers: Answer[], inputMode: InputMode): number {
  return R.length(R.takeLastWhile(answer => isAnswerCorrect(answer, inputMode), answers));
}

export function isStreakAtThreshold(streak: number): boolean {
  return streak > 1 && (R.includes(streak, streakThresholds) || streak % streakModulus === 0);
}

function computeStreaks(answers: Answer[], inputMode: InputMode): number[] {
  return R.reduce((acc, value) =>
      isAnswerCorrect(value, inputMode)
        ? R.append(R.last(acc)! + 1, R.init(acc)) // Add 1 to the last streak already in the array
        : R.append(0, acc) // Create a new streak initialised to 0
    , [0], answers);
}

export function computeBaseScore(answer: Answer, mode: Mode, inputMode: InputMode): number {
  if (!isAnswerCorrect(answer, inputMode) || answer.timeTaken === null) {
    return 0;
  }

  const isTimed = mode === "timed";
  const maxTimedScore = 1000000;
  const nonTimedScore = 500;

  return isTimed ? maxTimedScore / answer.timeTaken : nonTimedScore;
}

function computeTotalBaseScore(answers: Answer[], mode: Mode, inputMode: InputMode): number {
  return R.sum(R.map(answer =>  computeBaseScore(answer, mode, inputMode), answers));
}

function computeStreakScore(streak: number): number {
  let thresholdsExceeded = 0;
  thresholdsExceeded += R.length(R.filter(streakThreshold => streak >= streakThreshold, streakThresholds));
  thresholdsExceeded += Math.floor(streak / streakModulus);

  return thresholdsExceeded * scorePerStreak;
}

function computeTotalStreakScore(streaks: number[]): number {
  return R.sum(R.map(computeStreakScore, streaks));
}

function computeTotalScore(totalBaseScore: number, totalStreakScore: number, allCorrectAchievementBonus: number) {
  return totalBaseScore + totalStreakScore + allCorrectAchievementBonus;
}

export function isAllCorrectAchievement(answers: Answer[], inputMode: InputMode): boolean {
  return R.length(answers) >= 3 && R.all(answer => isAnswerCorrect(answer, inputMode), answers);
}

function computeAllCorrectAchievementBonus(answers: Answer[], inputMode: InputMode): number {
  return isAllCorrectAchievement(answers, inputMode) ? allCorrectAchievementScore * R.length(answers) : 0;
}

export function computeScores(answers: Answer[], mode: Mode, inputMode: InputMode): Scores {
  const streaks = computeStreaks(answers, inputMode);

  // Calculate score
  // Base score is a score for answering a question, based on the time taken
  const totalBaseScore = computeTotalBaseScore(answers, mode, inputMode);
  const totalStreakScore = computeTotalStreakScore(streaks);
  const allCorrectAchievementBonus = computeAllCorrectAchievementBonus(answers, inputMode);
  const totalScore = computeTotalScore(totalBaseScore, totalStreakScore, allCorrectAchievementBonus);

  return {
    streaks,
    totalBaseScore,
    totalStreakScore,
    allCorrectAchievementBonus,
    totalScore,
  };
}

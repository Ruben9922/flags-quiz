import * as R from "ramda";
import Answer, {isAnswerCorrect} from "./answer";

interface Scores {
  correctAnswersTimeTaken: number[];
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

export function computeStreak(answers: Answer[]): number {
  return R.length(R.takeLastWhile(isAnswerCorrect, answers));
}

export function isStreakAtThreshold(streak: number): boolean {
  return streak > 1 && (R.includes(streak, streakThresholds) || streak % streakModulus === 0);
}

function computeStreaks(answers: Answer[]): number[] {
  return R.reduce((acc, value) =>
      isAnswerCorrect(value)
        ? R.append(R.last(acc)! + 1, R.init(acc)) // Add 1 to the last streak already in the array
        : R.append(0, acc) // Create a new streak initialised to 0
    , [0], answers);
}

function computeBaseScore(time: number): number {
  return 1000000 / time;
}

function computeCorrectAnswersTimeTaken(answers: Answer[]) {
  return R.map((answer: Answer) => answer.timeTaken!, R.filter(answer => isAnswerCorrect(answer) && answer.timeTaken !== null, answers));
}

function computeTotalBaseScore(times: number[]): number {
  return R.sum(R.map(computeBaseScore, times));
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

export function isAllCorrectAchievement(answers: Answer[]): boolean {
  return R.length(answers) >= 3 && R.all(isAnswerCorrect, answers);
}

function computeAllCorrectAchievementBonus(answers: Answer[]): number {
  return isAllCorrectAchievement(answers) ? allCorrectAchievementScore * R.length(answers) : 0;
}

export function computeScores(answers: Answer[]): Scores {
  const correctAnswersTimeTaken = computeCorrectAnswersTimeTaken(answers);
  const streaks = computeStreaks(answers);

  // Calculate score
  // Base score is a score for answering a question, based on the time taken
  const totalBaseScore = computeTotalBaseScore(correctAnswersTimeTaken);
  const totalStreakScore = computeTotalStreakScore(streaks);
  const allCorrectAchievementBonus = computeAllCorrectAchievementBonus(answers);
  const totalScore = computeTotalScore(totalBaseScore, totalStreakScore, allCorrectAchievementBonus);

  return {
    correctAnswersTimeTaken,
    streaks,
    totalBaseScore,
    totalStreakScore,
    allCorrectAchievementBonus,
    totalScore,
  };
}

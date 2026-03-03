import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Turn } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTotalPoints = (turns: Turn[]) => {
  return turns.reduce((sum, t) => sum + t.points, 0);
};

export const calculateMatchPoints = (total: number, target: number) => {
  if (target === 0) return "0.00";
  return ((total / target) * 10).toFixed(2);
};

export const calculateAverage = (total: number, numTurns: number) => {
  if (numTurns === 0) return "0.00";
  return (total / numTurns).toFixed(2);
};

export const calculateHighestSeries = (turns: Turn[]) => {
  if (turns.length === 0) return 0;
  return Math.max(...turns.map(t => t.points));
};

import type { CharacterState, ValidationIssue } from "../models";

export interface LevelUpSummary {
  nextLevel: number;
  gains: string[];
}

export function summarizeLevelUp(state: CharacterState): LevelUpSummary {
  const nextLevel = state.level + 1;
  return {
    nextLevel,
    gains: ["Gain a skill rank", "Select a talent if eligible"]
  };
}

export function validateLevelUp(state: CharacterState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (state.level >= 20) {
    issues.push({ severity: "error", message: "Character is already at max level." });
  }
  return issues;
}

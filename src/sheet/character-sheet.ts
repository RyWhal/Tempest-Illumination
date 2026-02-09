import type { CharacterState, DerivedStats, ValidationIssue } from "../models";
import { computeDerivedStats, validateAudit } from "../wizard/steps";

export interface CharacterSheetView {
  state: CharacterState;
  derived: DerivedStats;
  validation: ValidationIssue[];
}

export function buildCharacterSheet(state: CharacterState): CharacterSheetView {
  return {
    state,
    derived: computeDerivedStats(state),
    validation: validateAudit(state)
  };
}

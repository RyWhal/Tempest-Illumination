import type { CharacterState, DerivedStats, ValidationIssue } from "../models";

export interface WizardStep {
  key: string;
  title: string;
  validate: (state: CharacterState) => ValidationIssue[];
}

export const wizardSteps: WizardStep[] = [
  { key: "origins", title: "Origins", validate: validateOrigins },
  { key: "path", title: "Starting Path", validate: validatePath },
  { key: "attributes", title: "Attributes", validate: validateAttributes },
  { key: "skills", title: "Skills & Expertises", validate: validateSkills },
  { key: "talents", title: "Talents", validate: validateTalents },
  { key: "equipment", title: "Equipment", validate: validateEquipment },
  { key: "story", title: "Story Metadata", validate: validateStory },
  { key: "audit", title: "Final Audit", validate: validateAudit }
];

export function validateOrigins(state: CharacterState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!state.ancestryKey) {
    issues.push({ severity: "error", message: "Select an ancestry.", ruleKey: "ancestry_selection" });
  }
  if (state.cultureKeys.length !== 2) {
    issues.push({
      severity: "error",
      message: "Select exactly two cultural expertises.",
      ruleKey: "culture_selection"
    });
  }
  return issues;
}

export function validatePath(state: CharacterState): ValidationIssue[] {
  if (!state.pathKey) {
    return [{ severity: "error", message: "Select a starting path.", ruleKey: "path_selection" }];
  }
  return [];
}

export function validateAttributes(state: CharacterState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const values = Object.values(state.attributes);
  if (values.some((value) => value < 0)) {
    issues.push({ severity: "error", message: "Attributes cannot be negative.", ruleKey: "attribute_bounds" });
  }
  return issues;
}

export function validateSkills(state: CharacterState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const overCap = Object.entries(state.skills).filter(([, rank]) => rank > 2);
  if (overCap.length > 0) {
    issues.push({ severity: "error", message: "Skill rank cap exceeded.", ruleKey: "skill_rank_cap" });
  }
  return issues;
}

export function validateTalents(state: CharacterState): ValidationIssue[] {
  if (state.talents.length === 0) {
    return [{ severity: "warning", message: "No talents selected yet.", ruleKey: "talent_minimum" }];
  }
  return [];
}

export function validateEquipment(state: CharacterState): ValidationIssue[] {
  if (state.inventory.length === 0) {
    return [{ severity: "warning", message: "No starting kit selected yet.", ruleKey: "kit_selection" }];
  }
  return [];
}

export function validateStory(state: CharacterState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!state.identity.name) {
    issues.push({ severity: "error", message: "Character name is required.", ruleKey: "story_name" });
  }
  if (state.identity.goals.length === 0) {
    issues.push({ severity: "warning", message: "Add at least one goal.", ruleKey: "story_goals" });
  }
  return issues;
}

export function validateAudit(state: CharacterState): ValidationIssue[] {
  return wizardSteps.flatMap((step) => step.key !== "audit" ? step.validate(state) : []);
}

export function computeDerivedStats(state: CharacterState): DerivedStats {
  const presence = state.attributes.presence ?? 0;
  return {
    defenses: { resolve: presence },
    movement: 6,
    recoveryDie: "d6",
    senses: [],
    resources: { health: 10, focus: 5, investiture: 0 }
  };
}

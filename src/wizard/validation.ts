import {
  CharacterData,
  ValidationIssue,
  ValidationResult,
} from "../models/character";
import { ruleCitations } from "../advancement/ruleCitations";

const buildResult = (issues: ValidationIssue[]): ValidationResult => ({
  valid: issues.length === 0,
  issues,
});

export const validateOrigins = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!character.origins.homeland) {
    issues.push({
      field: "origins.homeland",
      message: "Select a homeland for the character.",
      ruleCitationKey: ruleCitations.origins.key,
    });
  }

  if (!character.origins.culture) {
    issues.push({
      field: "origins.culture",
      message: "Select a culture for the character.",
      ruleCitationKey: ruleCitations.origins.key,
    });
  }

  return buildResult(issues);
};

export const validatePath = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!character.path.order) {
    issues.push({
      field: "path.order",
      message: "Choose a Radiant Order or equivalent path.",
      ruleCitationKey: ruleCitations.path.key,
    });
  }

  return buildResult(issues);
};

export const validateAttributes = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const values = Object.values(character.attributes);

  if (values.some((value) => value <= 0)) {
    issues.push({
      field: "attributes",
      message: "All attributes must be greater than zero.",
      ruleCitationKey: ruleCitations.attributes.key,
    });
  }

  return buildResult(issues);
};

export const validateSkills = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (Object.keys(character.skills.trained).length === 0) {
    issues.push({
      field: "skills.trained",
      message: "Train at least one skill.",
      ruleCitationKey: ruleCitations.skills.key,
    });
  }

  return buildResult(issues);
};

export const validateTalents = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (character.talents.selections.length === 0) {
    issues.push({
      field: "talents.selections",
      message: "Select at least one talent.",
      ruleCitationKey: ruleCitations.talents.key,
    });
  }

  return buildResult(issues);
};

export const validateEquipment = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (character.equipment.items.length === 0) {
    issues.push({
      field: "equipment.items",
      message: "Choose starting equipment.",
      ruleCitationKey: ruleCitations.equipment.key,
    });
  }

  return buildResult(issues);
};

export const validateStory = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (character.story.motivations.length === 0) {
    issues.push({
      field: "story.motivations",
      message: "Add at least one motivation.",
      ruleCitationKey: ruleCitations.story.key,
    });
  }

  return buildResult(issues);
};

export const validateFinalAudit = (character: CharacterData): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!character.finalAudit.acknowledgedRules) {
    issues.push({
      field: "finalAudit.acknowledgedRules",
      message: "Confirm you reviewed the audit summary.",
      ruleCitationKey: ruleCitations.finalAudit.key,
    });
  }

  return buildResult(issues);
};

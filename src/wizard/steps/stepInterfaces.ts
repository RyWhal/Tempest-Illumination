import {
  AttributesData,
  CharacterData,
  EquipmentData,
  FinalAuditData,
  OriginsData,
  PathData,
  SkillsData,
  StoryData,
  TalentsData,
  ValidationResult,
} from "../../models/character";
import {
  validateAttributes,
  validateEquipment,
  validateFinalAudit,
  validateOrigins,
  validatePath,
  validateSkills,
  validateStory,
  validateTalents,
} from "../validation";

export type WizardStepId =
  | "origins"
  | "path"
  | "attributes"
  | "skills"
  | "talents"
  | "equipment"
  | "story"
  | "final-audit";

export interface WizardStep<TData> {
  id: WizardStepId;
  title: string;
  getData: (character: CharacterData) => TData;
  setData: (character: CharacterData, data: TData) => CharacterData;
  validate: (character: CharacterData) => ValidationResult;
}

export interface OriginsStep extends WizardStep<OriginsData> {
  id: "origins";
}

export interface PathStep extends WizardStep<PathData> {
  id: "path";
}

export interface AttributesStep extends WizardStep<AttributesData> {
  id: "attributes";
}

export interface SkillsStep extends WizardStep<SkillsData> {
  id: "skills";
}

export interface TalentsStep extends WizardStep<TalentsData> {
  id: "talents";
}

export interface EquipmentStep extends WizardStep<EquipmentData> {
  id: "equipment";
}

export interface StoryStep extends WizardStep<StoryData> {
  id: "story";
}

export interface FinalAuditStep extends WizardStep<FinalAuditData> {
  id: "final-audit";
}

export const wizardSteps: Array<
  | OriginsStep
  | PathStep
  | AttributesStep
  | SkillsStep
  | TalentsStep
  | EquipmentStep
  | StoryStep
  | FinalAuditStep
> = [
  {
    id: "origins",
    title: "Origins",
    getData: (character) => character.origins,
    setData: (character, data) => ({
      ...character,
      origins: data,
    }),
    validate: validateOrigins,
  },
  {
    id: "path",
    title: "Path",
    getData: (character) => character.path,
    setData: (character, data) => ({
      ...character,
      path: data,
    }),
    validate: validatePath,
  },
  {
    id: "attributes",
    title: "Attributes",
    getData: (character) => character.attributes,
    setData: (character, data) => ({
      ...character,
      attributes: data,
    }),
    validate: validateAttributes,
  },
  {
    id: "skills",
    title: "Skills",
    getData: (character) => character.skills,
    setData: (character, data) => ({
      ...character,
      skills: data,
    }),
    validate: validateSkills,
  },
  {
    id: "talents",
    title: "Talents",
    getData: (character) => character.talents,
    setData: (character, data) => ({
      ...character,
      talents: data,
    }),
    validate: validateTalents,
  },
  {
    id: "equipment",
    title: "Equipment",
    getData: (character) => character.equipment,
    setData: (character, data) => ({
      ...character,
      equipment: data,
    }),
    validate: validateEquipment,
  },
  {
    id: "story",
    title: "Story",
    getData: (character) => character.story,
    setData: (character, data) => ({
      ...character,
      story: data,
    }),
    validate: validateStory,
  },
  {
    id: "final-audit",
    title: "Final Audit",
    getData: (character) => character.finalAudit,
    setData: (character, data) => ({
      ...character,
      finalAudit: data,
    }),
    validate: validateFinalAudit,
  },
];

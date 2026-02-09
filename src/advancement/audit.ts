import { CharacterData } from "../models/character";
import { ruleCitations } from "./ruleCitations";
import {
  validateAttributes,
  validateEquipment,
  validateFinalAudit,
  validateOrigins,
  validatePath,
  validateSkills,
  validateStory,
  validateTalents,
} from "../wizard/validation";

export interface AuditEntry {
  label: string;
  valid: boolean;
  issues: string[];
  citation: string;
}

export const buildAuditEntries = (character: CharacterData): AuditEntry[] => {
  const validations = [
    { label: "Origins", result: validateOrigins(character), citation: ruleCitations.origins },
    { label: "Path", result: validatePath(character), citation: ruleCitations.path },
    {
      label: "Attributes",
      result: validateAttributes(character),
      citation: ruleCitations.attributes,
    },
    { label: "Skills", result: validateSkills(character), citation: ruleCitations.skills },
    { label: "Talents", result: validateTalents(character), citation: ruleCitations.talents },
    {
      label: "Equipment",
      result: validateEquipment(character),
      citation: ruleCitations.equipment,
    },
    { label: "Story", result: validateStory(character), citation: ruleCitations.story },
    {
      label: "Final Audit",
      result: validateFinalAudit(character),
      citation: ruleCitations.finalAudit,
    },
  ];

  return validations.map(({ label, result, citation }) => ({
    label,
    valid: result.valid,
    issues: result.issues.map((issue) => issue.message),
    citation: `${citation.label} (${citation.source}${citation.anchor ?? ""})`,
  }));
};

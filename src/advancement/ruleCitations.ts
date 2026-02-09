export interface RuleCitation {
  key: string;
  label: string;
  source: string;
  anchor?: string;
}

export const ruleCitations = {
  origins: {
    key: "origins",
    label: "Origins selection",
    source: "docs/rules/character-creation.md",
    anchor: "#origins",
  },
  path: {
    key: "path",
    label: "Path selection",
    source: "docs/rules/character-creation.md",
    anchor: "#path",
  },
  attributes: {
    key: "attributes",
    label: "Attribute allocation",
    source: "docs/rules/character-creation.md",
    anchor: "#attributes",
  },
  skills: {
    key: "skills",
    label: "Skill training",
    source: "docs/rules/character-creation.md",
    anchor: "#skills",
  },
  talents: {
    key: "talents",
    label: "Talent selection",
    source: "docs/rules/character-creation.md",
    anchor: "#talents",
  },
  equipment: {
    key: "equipment",
    label: "Starting equipment",
    source: "docs/rules/item-rules.md",
    anchor: "#equipment",
  },
  story: {
    key: "story",
    label: "Story details",
    source: "docs/rules/character-creation.md",
    anchor: "#story",
  },
  finalAudit: {
    key: "final-audit",
    label: "Final audit",
    source: "docs/rules/character-creation.md",
    anchor: "#final-audit",
  },
} satisfies Record<string, RuleCitation>;

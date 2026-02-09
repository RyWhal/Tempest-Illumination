export type AttributeKey =
  | "strength"
  | "speed"
  | "intellect"
  | "willpower"
  | "awareness"
  | "presence";

export type SkillCategory = "Physical" | "Cognitive" | "Spiritual";

export interface SourceCitation {
  page: string;
  excerpt: string;
}

export interface PrerequisiteClause {
  type: string;
  key?: string;
  skill?: string;
  min?: number;
}

export interface PrerequisiteSet {
  all?: PrerequisiteClause[];
  any?: PrerequisiteClause[];
  none?: PrerequisiteClause[];
}

export interface AncestryEffect {
  type: string;
  count?: number;
  pool?: string;
  source?: SourceCitation;
}

export interface Ancestry {
  key: string;
  name: string;
  description: string;
  effects: AncestryEffect[];
}

export interface CulturalExpertise {
  key: string;
  name: string;
  description: string;
  language?: string;
  subchoices: string[];
  source?: SourceCitation;
}

export interface Skill {
  key: string;
  name: string;
  category: SkillCategory;
  description: string;
  source?: SourceCitation;
}

export interface Talent {
  key: string;
  name: string;
  activation: string;
  description: string;
  prerequisites?: PrerequisiteSet;
  source?: SourceCitation;
}

export interface Item {
  key: string;
  name: string;
  type: string;
  traits: string[];
  source?: SourceCitation;
}

export interface Kit {
  key: string;
  name: string;
  items: string[];
  source?: SourceCitation;
}

export interface CharacterIdentity {
  name: string;
  playerName: string;
  purpose: string;
  obstacle: string;
  goals: string[];
  notes?: string;
}

export interface CharacterState {
  level: number;
  ancestryKey?: string;
  cultureKeys: string[];
  pathKey?: string;
  attributes: Record<AttributeKey, number>;
  skills: Record<string, number>;
  expertises: string[];
  talents: string[];
  inventory: string[];
  identity: CharacterIdentity;
}

export interface DerivedStats {
  defenses: Record<string, number>;
  movement: number;
  recoveryDie: string;
  senses: string[];
  resources: Record<string, number>;
}

export interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
  ruleKey?: string;
}

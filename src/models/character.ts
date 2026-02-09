export interface OriginsData {
  homeland: string | null;
  culture: string | null;
  background: string | null;
}

export interface PathData {
  order: string | null;
  calling: string | null;
  oathLevel: number;
}

export interface AttributesData {
  might: number;
  agility: number;
  intellect: number;
  willpower: number;
  charisma: number;
}

export interface SkillsData {
  trained: Record<string, number>;
}

export interface TalentsData {
  selections: string[];
}

export interface EquipmentData {
  items: string[];
  currency: number;
}

export interface StoryData {
  motivations: string[];
  connections: string[];
  notes: string;
}

export interface FinalAuditData {
  acknowledgedRules: boolean;
  auditNotes: string[];
}

export interface CharacterData {
  name: string;
  origins: OriginsData;
  path: PathData;
  attributes: AttributesData;
  skills: SkillsData;
  talents: TalentsData;
  equipment: EquipmentData;
  story: StoryData;
  finalAudit: FinalAuditData;
}

export interface DerivedStats {
  vitality: number;
  resolve: number;
  focus: number;
  initiative: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
  ruleCitationKey?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export const defaultCharacterData: CharacterData = {
  name: "New Character",
  origins: {
    homeland: null,
    culture: null,
    background: null,
  },
  path: {
    order: null,
    calling: null,
    oathLevel: 0,
  },
  attributes: {
    might: 1,
    agility: 1,
    intellect: 1,
    willpower: 1,
    charisma: 1,
  },
  skills: {
    trained: {},
  },
  talents: {
    selections: [],
  },
  equipment: {
    items: [],
    currency: 0,
  },
  story: {
    motivations: [],
    connections: [],
    notes: "",
  },
  finalAudit: {
    acknowledgedRules: false,
    auditNotes: [],
  },
};

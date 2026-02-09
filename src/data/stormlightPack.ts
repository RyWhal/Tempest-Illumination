export interface SourceInfo {
  pdf: string;
  page: number;
}

export interface PackRecord {
  id: string;
  name: string;
  rulesText: string;
  source: SourceInfo;
  allowedAncestries?: string[];
}

export interface HeroicPathRecord extends PackRecord {
  theme: string;
  specialties: string[];
  startingSkill: string;
  keyTalentId: string;
  keyTalentSummary: string;
}

export interface SkillRecord {
  id: string;
  name: string;
  attribute: string;
  category: string;
  source: SourceInfo;
}

export interface TalentRecord extends PackRecord {
  subtype: string;
  activationText: string;
  prerequisiteText: string;
  path?: string;
  radiantOrder?: string;
}

export interface KitRecord extends PackRecord {
  grants: { type: string; target: string; amount: number }[];
}

export interface ItemRecord extends PackRecord {
  tags: string[];
}

export const ancestries: PackRecord[] = [
  {
    id: "sl.ancestry.human",
    name: "Human",
    rulesText:
      "Humans are the most widespread ancestry on Roshar. You are Medium and gain bonus talents from heroic paths at each tier (levels 1, 6, 11, 16, and 21).",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 33 }
  },
  {
    id: "sl.ancestry.singer",
    name: "Singer",
    rulesText:
      "Singers bond spren during highstorms to adopt forms. You are Medium, gain the Change Form key talent at level 1, and gain bonus talents at each tier from the Singer tree or heroic paths.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 33 }
  }
];

export const culturalExpertises: PackRecord[] = [
  {
    id: "sl.expertise.cultural.alethi",
    name: "Alethi Expertise",
    rulesText:
      "You know Alethi princedoms, dialects, and Vorin cultural touchstones. Choose proficiency levels for spoken Alethi, glyphs, and women’s script.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.azish",
    name: "Azish Expertise",
    rulesText:
      "You know Azish bureaucracy, member-state facts, and civic procedures. Choose proficiency levels for Azish sign, spoken Azish, and written Azish.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.iriali",
    name: "Iriali Expertise",
    rulesText:
      "You know Iriali traditions, Long Trail beliefs, and Iriali dialects. Choose proficiency levels for spoken Iriali, art, and navigation.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.kharbranthian",
    name: "Kharbranthian Expertise",
    rulesText:
      "You know Kharbranthian trade, scholarship, and city-state customs. Choose proficiency levels for spoken Kharbranthian, commerce, and etiquette.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.listener",
    name: "Listener Expertise",
    rulesText:
      "You know listener songs, forms, and rhythms. Choose proficiency levels for listener songs, forms lore, and rhythm awareness.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 },
    allowedAncestries: ["sl.ancestry.singer"]
  },
  {
    id: "sl.expertise.cultural.natan",
    name: "Natan Expertise",
    rulesText:
      "You know Natan customs, coastal life, and sea lore. Choose proficiency levels for spoken Natan, fishing, and navigation.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.reshi",
    name: "Reshi Expertise",
    rulesText:
      "You know Reshi island culture, traveling caravans, and oral traditions. Choose proficiency levels for spoken Reshi, survival, and storytelling.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.shin",
    name: "Shin Expertise",
    rulesText:
      "You know Shin customs, stone taboos, and farming practices. Choose proficiency levels for spoken Shin, agriculture, and diplomacy.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.thaylen",
    name: "Thaylen Expertise",
    rulesText:
      "You know Thaylen merchant codes, maritime routes, and Thaylen speech. Choose proficiency levels for spoken Thaylen, commerce, and navigation.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.unkalaki",
    name: "Unkalaki Expertise",
    rulesText:
      "You know Unkalaki (Horneater) traditions, peaks rituals, and cuisine. Choose proficiency levels for spoken Unkalaki, cooking, and survival.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.veden",
    name: "Veden Expertise",
    rulesText:
      "You know Veden politics, military customs, and dialects. Choose proficiency levels for spoken Veden, tactics, and etiquette.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.wayfarer",
    name: "Wayfarer Expertise",
    rulesText:
      "You know Wayfarer trails, migrant caravans, and multilingual travel. Choose proficiency levels for navigation, trade, and spoken languages.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 41 }
  },
  {
    id: "sl.expertise.cultural.other",
    name: "Other",
    rulesText: "Other expertises with GM approval (Player Handbook p. 45).",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 45 }
  }
];

export const heroicPaths: HeroicPathRecord[] = [
  {
    id: "sl.heroic_path.agent",
    name: "Agent",
    rulesText:
      "Agents specialize in subtlety and problem-solving, gaining the Opportunist key talent and access to investigative specialties.",
    theme: "A talented operative who solves problems with a keen mind or deft hand.",
    specialties: ["Investigator", "Spy", "Thief"],
    startingSkill: "Insight",
    keyTalentId: "sl.talent.heroic.agent_key",
    keyTalentSummary: "Opportunist: Reroll the plot die once per round.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 78 }
  },
  {
    id: "sl.heroic_path.envoy",
    name: "Envoy",
    rulesText:
      "Envoys rally allies through presence and conviction, starting with Rousing Presence and social specialties.",
    theme: "An insightful negotiator who adeptly influences others.",
    specialties: ["Diplomat", "Faithful", "Mentor"],
    startingSkill: "Discipline",
    keyTalentId: "sl.talent.heroic.envoy_key",
    keyTalentSummary: "Rousing Presence: Make an ally Determined.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 86 }
  },
  {
    id: "sl.heroic_path.hunter",
    name: "Hunter",
    rulesText:
      "Hunters excel at pursuit and precision, beginning with Seek Quarry and ranged specialties.",
    theme: "A skilled sharpshooter and outdoorsperson who seeks and eliminates problems.",
    specialties: ["Archer", "Assassin", "Tracker"],
    startingSkill: "Perception",
    keyTalentId: "sl.talent.heroic.hunter_key",
    keyTalentSummary: "Seek Quarry: Choose a character to pursue and gain an advantage against them.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 94 }
  },
  {
    id: "sl.heroic_path.leader",
    name: "Leader",
    rulesText:
      "Leaders coordinate the team with decisive direction, starting with Decisive Command.",
    theme: "A poised commander who directs and guides others to be their best.",
    specialties: ["Champion", "Officer", "Politico"],
    startingSkill: "Leadership",
    keyTalentId: "sl.talent.heroic.leader_key",
    keyTalentSummary: "Decisive Command: Add a d4 command die to an ally’s tests.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 102 }
  },
  {
    id: "sl.heroic_path.scholar",
    name: "Scholar",
    rulesText:
      "Scholars focus on knowledge and preparation, starting with Erudition and intellectual specialties.",
    theme: "An adroit thinker who excels at planning and building.",
    specialties: ["Artifabrian", "Strategist", "Surgeon"],
    startingSkill: "Lore",
    keyTalentId: "sl.talent.heroic.scholar_key",
    keyTalentSummary: "Erudition: Gain bonus skill ranks that you can reallocate.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 111 }
  },
  {
    id: "sl.heroic_path.warrior",
    name: "Warrior",
    rulesText:
      "Warriors rely on battlefield prowess, beginning with Vigilant Stance and martial specialties.",
    theme: "A fighter who relies on skill, brute strength, or indomitable will.",
    specialties: ["Duelist", "Shardbearer", "Soldier"],
    startingSkill: "Athletics",
    keyTalentId: "sl.talent.heroic.warrior_key",
    keyTalentSummary:
      "Vigilant Stance: Gain a fighting stance that makes you more responsive and flexible in combat.",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 118 }
  }
];

export const skills: SkillRecord[] = [
  {
    id: "sl.skill.agility",
    name: "Agility",
    attribute: "Speed",
    category: "Physical",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 63 }
  },
  {
    id: "sl.skill.lore",
    name: "Lore",
    attribute: "Intellect",
    category: "Cognitive",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 63 }
  },
  {
    id: "sl.skill.persuasion",
    name: "Persuasion",
    attribute: "Presence",
    category: "Spiritual",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 63 }
  }
];

export const talents: TalentRecord[] = [
  {
    id: "sl.talent.heroic.agent_key",
    name: "Opportunist (Agent Key)",
    rulesText: "Once per round, when you roll a plot die, you can reroll that result.",
    subtype: "heroic_key",
    path: "Agent",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 78 }
  },
  {
    id: "sl.talent.heroic.envoy_key",
    name: "Rousing Presence (Envoy Key)",
    rulesText: "Choose an ally you can influence. They become Determined until the scene ends.",
    subtype: "heroic_key",
    path: "Envoy",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 86 }
  },
  {
    id: "sl.talent.heroic.hunter_key",
    name: "Seek Quarry (Hunter Key)",
    rulesText:
      "After 1 minute of preparation, choose a character as your quarry and gain an advantage against them.",
    subtype: "heroic_key",
    path: "Hunter",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 94 }
  },
  {
    id: "sl.talent.heroic.leader_key",
    name: "Decisive Command (Leader Key)",
    rulesText:
      "Spend 1 focus to grant an ally a command die that can be added to their next test.",
    subtype: "heroic_key",
    path: "Leader",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 102 }
  },
  {
    id: "sl.talent.heroic.scholar_key",
    name: "Erudition (Scholar Key)",
    rulesText:
      "Choose one expertise you don’t already have and two cognitive skills to gain temporary ranks.",
    subtype: "heroic_key",
    path: "Scholar",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 111 }
  },
  {
    id: "sl.talent.heroic.warrior_key",
    name: "Vigilant Stance (Warrior Key)",
    rulesText:
      "Learn a stance and reduce the focus cost of your Dodge and Reactive Strike reactions by 1.",
    subtype: "heroic_key",
    path: "Warrior",
    activationText: "",
    prerequisiteText: "none",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 118 }
  },
  {
    id: "sl.talent.singer.change_form_key",
    name: "Change Form (Singer Key)",
    rulesText:
      "During a highstorm, you can change into another singer form by bonding the appropriate spren.",
    subtype: "singer_key",
    activationText: "(during a highstorm)",
    prerequisiteText: "Singer ancestry",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 35 }
  },
  {
    id: "sl.talent.radiant.windrunner_first_ideal_key",
    name: "First Ideal (Windrunner Key)",
    rulesText:
      "Begin bonding an honorspren, gain investiture, and unlock Adhesion and Gravitation surges.",
    subtype: "radiant_key",
    radiantOrder: "Windrunner",
    activationText: "",
    prerequisiteText: "Level 2+",
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 204 }
  }
];

export const kits: KitRecord[] = [
  {
    id: "sl.kit.field_scout",
    name: "Field Scout Kit",
    rulesText: "A practical kit for scouting missions and wilderness travel.",
    grants: [
      { type: "item", target: "sl.item.spear", amount: 1 },
      { type: "item", target: "sl.item.safepouch", amount: 1 }
    ],
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 150 }
  }
];

export const items: ItemRecord[] = [
  {
    id: "sl.item.spear",
    name: "Spear",
    rulesText:
      "A long reach weapon favored by soldiers. Use the Light Weaponry skill unless otherwise specified.",
    tags: ["weapon", "reach"],
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 152 }
  },
  {
    id: "sl.item.safepouch",
    name: "Safepouch",
    rulesText: "A pouch designed to keep spheres secure and protected from storms.",
    tags: ["gear"],
    source: { pdf: "Stormlight Handbook Digital.pdf", page: 150 }
  }
];

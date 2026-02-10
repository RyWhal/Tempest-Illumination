import { useState } from "react";
import {
  ancestries,
  culturalExpertises,
  heroicPaths,
  talents as stormlightTalents,
  skills
} from "./data/stormlightPack";
import type { CharacterState } from "./models";

const attributeList = [
  { key: "strength", label: "Strength" },
  { key: "speed", label: "Speed" },
  { key: "intellect", label: "Intellect" },
  { key: "willpower", label: "Willpower" },
  { key: "awareness", label: "Awareness" },
  { key: "presence", label: "Presence" }
] as const;

type AttributeKey = (typeof attributeList)[number]["key"];

const emptyAttributes = attributeList.reduce<Record<AttributeKey, number>>(
  (acc, { key }) => {
    acc[key] = 0;
    return acc;
  },
  {} as Record<AttributeKey, number>
);

const initialState: CharacterState = {
  level: 1,
  ancestryKey: undefined,
  cultureKeys: [],
  pathKey: undefined,
  attributes: emptyAttributes,
  skills: {},
  expertises: [],
  talents: [],
  inventory: [],
  identity: {
    name: "",
    playerName: "",
    purpose: "",
    obstacle: "",
    goals: [],
    notes: ""
  }
};

const singerListenerCultureId = "sl.expertise.cultural.listener";

const additionalExpertiseOptions = [
  "Agriculture",
  "Art",
  "Commerce",
  "Cooking",
  "Diplomacy",
  "Etiquette",
  "Fishing",
  "Forms Lore",
  "Glyphs",
  "Literature",
  "Navigation",
  "Rhythm Awareness",
  "Sign Language",
  "Storytelling",
  "Survival",
  "Tactics",
  "Trade",
  "Women’s Script",
  "Written Records"
];

const startingKits = [
  {
    id: "academic",
    name: "Academic Kit",
    weapons: "One knife, sling, or staff",
    armor: "Uniform",
    equipment:
      "Backpack with common clothing, an ink pen, a bottle of ink, 10 sheets of paper, 3 empty vials, a block of wax, a reference book (GM approved), and 1 dose of weak poison.",
    spheres: "3d12 marks",
    additionalExpertise:
      "Gain the Literature expertise (or another culture/utility expertise if you already have it)."
  },
  {
    id: "artisan",
    name: "Artisan Kit",
    weapons: "One hammer or light weapon (your choice)",
    armor: "Leather armor",
    equipment:
      "Chest with common clothing, surgical supplies, 5 doses of weak antiseptic, an ink pen, a bottle of ink, 5 sheets of parchment, 5 candles, flint and steel, 3 empty glass bottles, a tuning fork, a musical instrument (your choice), and a scale.",
    spheres: "4d8 marks"
  },
  {
    id: "military",
    name: "Military Kit",
    weapons: "Two non-special weapons",
    armor: "Uniform and chain armor",
    equipment:
      "Backpack with common clothing, a waterskin, flint and steel, a whetstone, a blanket, and 10 days of food rations.",
    spheres: "2d6 marks"
  },
  {
    id: "courtier",
    name: "Courtier Kit",
    weapons: "One sidesword, greatsword, longsword, or longbow",
    armor: "None",
    equipment: "Alcohol (bottle of violet wine), fine clothing.",
    spheres: "4d20 marks",
    connection:
      "You’re supported by a patron of your noble house; it affords accommodations and a certain standard of living."
  },
  {
    id: "prisoner",
    name: "Prisoner Kit",
    weapons: "None",
    armor: "None",
    equipment: "Manacles, ragged clothing.",
    spheres: "None",
    connection:
      "You’ve attracted a Radiant spren; record the spren type in Connections and check two boxes for its key talent’s “Speak the First Ideal” goal if chosen later."
  },
  {
    id: "underworld",
    name: "Underworld Kit",
    weapons: "Two light weapons",
    armor: "Leather armor",
    equipment:
      "Backpack with common clothing, alcohol (bottle of Horneater white), a crowbar, a lockpick, 50 feet of rope, flint and steel, an oil lantern, a flask of oil, and 5 days of street food.",
    spheres: "1d20 marks"
  }
];

const equipmentItems = [
  { name: "Alcohol (1 serving)", price: 1 },
  { name: "Alcohol (bottle)", price: 1 },
  { name: "Anesthetic (5 doses)", price: 75 },
  { name: "Antiseptic (potent, 5 doses)", price: 50 },
  { name: "Antiseptic (weak, 5 doses)", price: 25 },
  { name: "Backpack", price: 8 },
  { name: "Barrel", price: 15 },
  { name: "Blanket", price: 2 },
  { name: "Book (reference)", price: 10 },
  { name: "Bottle (ceramic)", price: 1 },
  { name: "Bottle (glass)", price: 1 },
  { name: "Bucket", price: 1 },
  { name: "Candle", price: 1 },
  { name: "Case (leather)", price: 4 },
  { name: "Chain (thick, 10 feet)", price: 20 },
  { name: "Chain (thin, 1 foot)", price: 20 },
  { name: "Chest", price: 30 },
  { name: "Clothing (common)", price: 2 },
  { name: "Clothing (fine)", price: 50 },
  { name: "Clothing (ragged)", price: 1 },
  { name: "Crowbar", price: 10 },
  { name: "Ear trumpet", price: 50 },
  { name: "Flask or tankard", price: 1 },
  { name: "Flint and steel", price: 4 },
  { name: "Food (ration, 1 day)", price: 1 },
  { name: "Food (street, 1 day)", price: 3 },
  { name: "Food (fine, 1 day)", price: 25 },
  { name: "Grappling hook", price: 10 },
  { name: "Hammer (handheld)", price: 4 },
  { name: "Ink (1-ounce bottle)", price: 40 },
  { name: "Ink pen", price: 1 },
  { name: "Jug or pitcher", price: 2 },
  { name: "Ladder (10-foot)", price: 5 },
  { name: "Lantern (oil)", price: 20 },
  { name: "Lantern (sphere)", price: 20 },
  { name: "Lock and key", price: 50 },
  { name: "Lockpick", price: 5 },
  { name: "Magnifying lens", price: 400 },
  { name: "Manacles", price: 10 },
  { name: "Mirror (handheld)", price: 25 },
  { name: "Musical instrument", price: 1 },
  { name: "Net (hunting)", price: 4 },
  { name: "Net (fishing)", price: 10 },
  { name: "Oil (1 flask)", price: 1 },
  { name: "Paper or parchment (1 sheet)", price: 1 },
  { name: "Perfume (1 vial)", price: 20 },
  { name: "Pick (mining)", price: 10 },
  { name: "Poison (weak, 1 dose)", price: 20 },
  { name: "Poison (effectual, 1 dose)", price: 50 },
  { name: "Poison (potent, 1 dose)", price: 120 },
  { name: "Pot (iron)", price: 8 },
  { name: "Pouch", price: 1 },
  { name: "Pulley system", price: 100 },
  { name: "Rope (50 feet)", price: 30 },
  { name: "Sack", price: 1 },
  { name: "Scale", price: 20 },
  { name: "Shovel", price: 8 },
  { name: "Soap", price: 1 },
  { name: "Spyglass", price: 500 },
  { name: "Surgical supplies", price: 20 },
  { name: "Tent (two-person)", price: 10 },
  { name: "Treatment (medical, 1 dose)", price: 10 },
  { name: "Tuning fork", price: 50 },
  { name: "Unencased gem (infused)", price: 2 },
  { name: "Vial (glass)", price: 4 },
  { name: "Waterskin (empty)", price: 1 },
  { name: "Wax (1 block)", price: 2 },
  { name: "Whetstone", price: 1 }
];

const armorItems = [
  { name: "Uniform", price: 40 },
  { name: "Leather", price: 60 },
  { name: "Chain", price: 80 },
  { name: "Breastplate", price: 120 },
  { name: "Half Plate", price: 400 },
  { name: "Full Plate", price: 1600 }
];

const weaponItems = [
  { name: "Half-Shard", price: 2000 },
  { name: "Warhammer", price: 400 },
  { name: "Grandbow", price: 1000 },
  { name: "Axe", price: 20 },
  { name: "Greatsword", price: 200 },
  { name: "Hammer", price: 40 },
  { name: "Longspear", price: 15 },
  { name: "Longsword", price: 60 },
  { name: "Poleaxe", price: 40 },
  { name: "Shield", price: 10 },
  { name: "Crossbow", price: 200 },
  { name: "Longbow", price: 100 },
  { name: "Javelin", price: 20 },
  { name: "Knife", price: 8 },
  { name: "Mace", price: 20 },
  { name: "Rapier", price: 100 },
  { name: "Shortspear", price: 10 },
  { name: "Sidesword", price: 40 },
  { name: "Staff", price: 1 },
  { name: "Shortbow", price: 80 },
  { name: "Sling", price: 2 }
];

const sphereValues = [
  { gemstone: "Diamond", chip: 0.2, mark: 1, broam: 4 },
  { gemstone: "Garnet, Heliodor, Topaz", chip: 1, mark: 5, broam: 20 },
  { gemstone: "Ruby, Smokestone, Zircon", chip: 2, mark: 10, broam: 40 },
  { gemstone: "Amethyst, Sapphire", chip: 5, mark: 25, broam: 100 },
  { gemstone: "Emerald", chip: 10, mark: 50, broam: 200 }
];

const parseDice = (notation: string) => {
  const match = notation.match(/(\d+)d(\d+)/i);
  if (!match) {
    return null;
  }
  return { count: Number(match[1]), sides: Number(match[2]) };
};

const rollDice = (count: number, sides: number) =>
  Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1).reduce(
    (total, value) => total + value,
    0
  );

export default function App() {
  const [state, setState] = useState<CharacterState>(initialState);
  const [currentStep, setCurrentStep] = useState<"origin" | "origins">("origin");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const [rolledSpheres, setRolledSpheres] = useState<number | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<{ name: string; price: number }[]>([]);

  const selectedAncestry = ancestries.find((ancestry) => ancestry.id === state.ancestryKey);
  const selectedPath = heroicPaths.find((path) => path.id === state.pathKey);
  const startingSkill = skills.find((skill) => skill.name === selectedPath?.startingSkill);
  const startingSkillId = startingSkill?.id;
  const selectedKit = startingKits.find((kit) => kit.id === selectedKitId) ?? null;

  const isSinger = selectedAncestry?.id === "sl.ancestry.singer";
  const isHuman = selectedAncestry?.id === "sl.ancestry.human";

  const visibleCultures = culturalExpertises.filter((culture) => {
    if (!culture.allowedAncestries) {
      return true;
    }
    if (!selectedAncestry) {
      return true;
    }
    return culture.allowedAncestries.includes(selectedAncestry.id);
  });

  const handleAncestryChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      ancestryKey: value || undefined,
      cultureKeys:
        value === "sl.ancestry.human"
          ? prev.cultureKeys
          : value === "sl.ancestry.singer"
            ? [singerListenerCultureId]
            : []
    }));
  };

  const handleCultureToggle = (cultureId: string) => {
    setState((prev) => {
      const alreadySelected = prev.cultureKeys.includes(cultureId);
      if (alreadySelected) {
        return { ...prev, cultureKeys: prev.cultureKeys.filter((id) => id !== cultureId) };
      }
      if (prev.cultureKeys.length >= 2) {
        return prev;
      }
      return { ...prev, cultureKeys: [...prev.cultureKeys, cultureId] };
    });
  };

  const handlePathChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      pathKey: value || undefined,
      skills: (() => {
        const nextSkills = { ...prev.skills };
        const previousPath = heroicPaths.find((path) => path.id === prev.pathKey);
        const previousStartingSkill = skills.find(
          (skill) => skill.name === previousPath?.startingSkill
        );
        const previousStartingSkillId = previousStartingSkill?.id;
        const nextPath = heroicPaths.find((path) => path.id === value);
        const nextStartingSkill = skills.find((skill) => skill.name === nextPath?.startingSkill);
        const nextStartingSkillId = nextStartingSkill?.id;

        if (previousStartingSkillId && nextSkills[previousStartingSkillId]) {
          nextSkills[previousStartingSkillId] = Math.max(
            0,
            (nextSkills[previousStartingSkillId] ?? 0) - 1
          );
        }

        if (nextStartingSkillId) {
          nextSkills[nextStartingSkillId] = Math.min(
            2,
            (nextSkills[nextStartingSkillId] ?? 0) + 1
          );
        }

        return nextSkills;
      })()
    }));
  };

  const totalAttributePoints = 12;
  const maxAttributeScore = 3;
  const attributePointsSpent = attributeList.reduce(
    (total, attribute) => total + state.attributes[attribute.key],
    0
  );
  const attributePointsRemaining = totalAttributePoints - attributePointsSpent;

  const handleAttributeAdjust = (key: AttributeKey, delta: number) => {
    setState((prev) => {
      const currentValue = prev.attributes[key];
      const nextValue = Math.min(
        maxAttributeScore,
        Math.max(0, currentValue + delta)
      );
      const nextTotal = attributeList.reduce(
        (total, attribute) =>
          total + (attribute.key === key ? nextValue : prev.attributes[attribute.key]),
        0
      );
      if (nextTotal > totalAttributePoints) {
        return prev;
      }
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          [key]: nextValue
        }
      };
    });
  };

  const baseSkillRanks = 4;
  const totalSkillRanks = skills.reduce(
    (total, skill) => total + (state.skills[skill.id] ?? 0),
    0
  );
  const startingSkillBonus = startingSkillId ? 1 : 0;
  const spentSkillRanks = Math.max(0, totalSkillRanks - startingSkillBonus);
  const remainingSkillRanks = baseSkillRanks - spentSkillRanks;

  const handleSkillAdjust = (skillId: string, delta: number) => {
    setState((prev) => {
      const currentValue = prev.skills[skillId] ?? 0;
      const minValue = skillId === startingSkillId ? 1 : 0;
      const nextValue = Math.min(2, Math.max(minValue, currentValue + delta));
      const nextSkills = { ...prev.skills, [skillId]: nextValue };
      const nextTotal = skills.reduce(
        (total, skill) => total + (nextSkills[skill.id] ?? 0),
        0
      );
      const nextSpent = Math.max(0, nextTotal - (startingSkillId ? 1 : 0));
      if (nextSpent > baseSkillRanks) {
        return prev;
      }
      return { ...prev, skills: nextSkills };
    });
  };

  const maxAdditionalExpertises = Math.max(0, state.attributes.intellect);
  const totalExpertisesChosen = state.expertises.length;
  const canAddExpertise = totalExpertisesChosen < maxAdditionalExpertises;
  const availableExpertises = additionalExpertiseOptions.filter(
    (option) => !state.expertises.includes(option)
  );

  const handleExpertiseAdd = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      return;
    }
    setState((prev) => {
      if (prev.expertises.includes(cleaned) || prev.expertises.length >= maxAdditionalExpertises) {
        return prev;
      }
      return { ...prev, expertises: [...prev.expertises, cleaned] };
    });
  };

  const handleExpertiseRemove = (value: string) => {
    setState((prev) => ({
      ...prev,
      expertises: prev.expertises.filter((item) => item !== value)
    }));
  };

  const handleReset = () => {
    setState(initialState);
    setSelectedKitId(null);
    setRolledSpheres(null);
    setPurchasedItems([]);
  };

  const handleStartNewCharacter = () => {
    handleReset();
    setCurrentStep("origins");
  };

  const handleTalentAdd = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      return;
    }
    setState((prev) => {
      if (prev.talents.includes(cleaned)) {
        return prev;
      }
      return { ...prev, talents: [...prev.talents, cleaned] };
    });
  };

  const handleTalentRemove = (value: string) => {
    setState((prev) => ({
      ...prev,
      talents: prev.talents.filter((item) => item !== value)
    }));
  };

  const buildInventory = (
    kitId: string | null,
    spheres: number | null,
    purchases: { name: string; price: number }[]
  ) => {
    const kit = startingKits.find((entry) => entry.id === kitId);
    const kitItems = kit
      ? [kit.weapons, kit.armor, kit.equipment, kit.additionalExpertise, kit.connection]
          .filter(Boolean)
          .map((item) => item as string)
      : [];
    const sphereEntry = spheres !== null ? [`Spheres: ${spheres} marks`] : [];
    return [...kitItems, ...sphereEntry, ...purchases.map((entry) => entry.name)];
  };

  const handleKitSelect = (kitId: string) => {
    if (!kitId) {
      setSelectedKitId(null);
      setRolledSpheres(null);
      setPurchasedItems([]);
      setState((prev) => ({
        ...prev,
        inventory: buildInventory(null, null, [])
      }));
      return;
    }
    setSelectedKitId(kitId);
    setRolledSpheres(null);
    setPurchasedItems([]);
    setState((prev) => ({
      ...prev,
      inventory: buildInventory(kitId, null, [])
    }));
  };

  const handleSphereRoll = () => {
    const kit = startingKits.find((entry) => entry.id === selectedKitId);
    if (!kit || kit.spheres === "None") {
      setRolledSpheres(0);
      setState((prev) => ({
        ...prev,
        inventory: buildInventory(selectedKitId, 0, purchasedItems)
      }));
      return;
    }
    const dice = parseDice(kit.spheres);
    if (!dice) {
      setRolledSpheres(0);
      setState((prev) => ({
        ...prev,
        inventory: buildInventory(selectedKitId, 0, purchasedItems)
      }));
      return;
    }
    const total = rollDice(dice.count, dice.sides);
    setRolledSpheres(total);
    setState((prev) => ({
      ...prev,
      inventory: buildInventory(selectedKitId, total, purchasedItems)
    }));
  };

  const handlePurchase = (item: { name: string; price: number }) => {
    setPurchasedItems((prev) => {
      const updated = [...prev, item];
      setState((current) => ({
        ...current,
        inventory: buildInventory(selectedKitId, rolledSpheres, updated)
      }));
      return updated;
    });
  };

  const handlePurchaseRemove = (index: number) => {
    setPurchasedItems((prev) => {
      const updated = prev.filter((_, entryIndex) => entryIndex !== index);
      setState((current) => ({
        ...current,
        inventory: buildInventory(selectedKitId, rolledSpheres, updated)
      }));
      return updated;
    });
  };

  const handleIdentityChange = (field: keyof CharacterState["identity"], value: string) => {
    setState((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: value
      }
    }));
  };

  const handleGoalAdd = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      return;
    }
    setState((prev) => {
      if (prev.identity.goals.includes(cleaned)) {
        return prev;
      }
      return {
        ...prev,
        identity: {
          ...prev.identity,
          goals: [...prev.identity.goals, cleaned]
        }
      };
    });
  };

  const handleGoalRemove = (value: string) => {
    setState((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        goals: prev.identity.goals.filter((item) => item !== value)
      }
    }));
  };

  const isStep1Complete =
    Boolean(state.ancestryKey) && (!isHuman || state.cultureKeys.length === 2);
  const isStep2Complete = isStep1Complete && Boolean(state.pathKey);
  const isStep3Complete = isStep2Complete && attributePointsRemaining === 0;
  const isStep4Complete =
    isStep3Complete &&
    remainingSkillRanks === 0 &&
    totalExpertisesChosen === maxAdditionalExpertises;
  const isStep5Complete = isStep4Complete && state.talents.length > 0;
  const isStep6Complete = isStep5Complete && Boolean(selectedKitId);
  const selectedPathTalents = stormlightTalents.filter((talent) => {
    if (talent.path && selectedPath && talent.path === selectedPath.name) {
      return true;
    }
    if (isSinger && talent.subtype === "singer_key") {
      return true;
    }
    return false;
  });
  const remainingSpheres =
    rolledSpheres === null
      ? null
      : Math.max(0, rolledSpheres - purchasedItems.reduce((total, item) => total + item.price, 0));
  const derivedStats = {
    liftingCapacity: state.attributes.strength * 50,
    movementRate: 5 + state.attributes.speed,
    recoveryDie: `d${6 + state.attributes.willpower * 2}`,
    sensesRange: `${10 + state.attributes.awareness * 5} ft`
  };

  return (
    <div className="app">
      {currentStep === "origin" ? (
        <main className="origin-landing">
          <div className="origin-card">
            <p className="eyebrow">Choose your origin</p>
            <h1>Stormlight RPG Character Creator</h1>
            <p className="subtitle">
              Start a new character or bring in an existing sheet. We will build the rest step by
              step.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={handleStartNewCharacter} type="button">
                Start new character
              </button>
              <button className="ghost" type="button">
                Load existing sheet
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="modal-backdrop">
          <section className="origin-modal">
            <div className="origin-step">
              <div className="card-header">
                <h2>
                  <strong>Step 1 - Ancestry &amp; culture</strong>
                </h2>
              </div>
              <div className="origin-layout">
                <article className="form-card">
                  <div className="field-group">
                    <label className="field-label" htmlFor="ancestry-select">
                      Ancestry
                    </label>
                    <select
                      id="ancestry-select"
                      value={state.ancestryKey ?? ""}
                      onChange={(event) => handleAncestryChange(event.target.value)}
                    >
                      <option value="">Select ancestry</option>
                      {ancestries.map((ancestry) => (
                        <option key={ancestry.id} value={ancestry.id}>
                          {ancestry.name}
                        </option>
                      ))}
                    </select>
                    {selectedAncestry && (
                      <p className="field-hint">
                        {selectedAncestry.rulesText} (p. {selectedAncestry.source.page})
                      </p>
                    )}
                  </div>
                  {isSinger ? (
                    <div className="field-group">
                      <div className="callout">
                        <strong>Singers &amp; forms</strong>
                        <p>
                          Singers do not select cultural expertises. Instead, they gain forms and
                          the ability to change forms over time.
                        </p>
                      </div>
                      <ul className="benefit-list">
                        <li>
                          <strong>Unique Talent Tree (Level 1).</strong> Whenever you choose a new
                          talent, you can choose it from the Singer talent tree in this chapter (in
                          addition to the other trees you have access to).
                        </li>
                        <li>
                          <strong>Change Form (Level 1).</strong> You gain the Change Form (Singer
                          Key) talent from the Singer tree, along with one bonus talent that’s
                          connected to it. Decide which form to begin the game in, choosing from the
                          forms in these two talents. As you gain levels, you can learn new forms
                          from talents in the Singer tree.
                        </li>
                        <li>
                          <strong>Ancestry Bonus Talents (Level 6, 11, 16, and 21).</strong> Each time
                          you reach a new tier (as indicated on the Character Advancement table in
                          chapter 1), you again gain a bonus talent. You must choose it from the tree
                          or from any heroic path (see chapter 4).
                        </li>
                      </ul>
                      <div className="field-row">
                        <span className="field-label">Cultural expertise</span>
                      </div>
                      <div className="expertise-list">
                        {culturalExpertises
                          .filter((culture) => culture.id === singerListenerCultureId)
                          .map((culture) => (
                            <span key={culture.id} className="expertise-pill locked">
                              {culture.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="field-group">
                      <div className="field-row">
                        <label className="field-label">Cultural expertises</label>
                        <span className="field-meta">{state.cultureKeys.length}/2 selected</span>
                      </div>
                      {!isHuman && (
                        <p className="field-hint">Select a human ancestry to choose cultures.</p>
                      )}
                      <div className="option-grid">
                        {visibleCultures.map((culture) => {
                          const checked = state.cultureKeys.includes(culture.id);
                          const ancestryAllowed =
                            !culture.allowedAncestries ||
                            (selectedAncestry &&
                              culture.allowedAncestries.includes(selectedAncestry.id));
                          const disabled =
                            !isHuman ||
                            !ancestryAllowed ||
                            (!checked && state.cultureKeys.length >= 2);
                          return (
                            <label
                              key={culture.id}
                              className={`option-card${disabled ? " disabled" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                onChange={() => handleCultureToggle(culture.id)}
                              />
                              <span>
                                <strong>{culture.name}</strong>
                                <span>{culture.rulesText}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="callout">
                        <p>
                          Your character’s culture isn’t determined by birth or any other single
                          moment in time. Instead, cultural awareness can be shaped by nationality,
                          ethnicity, migration, traveling experience, and more.
                        </p>
                        <span className="field-meta">Player Handbook p. 38</span>
                      </div>
                    </div>
                  )}
                  {!isStep1Complete && (
                    <p className="field-hint">
                      Choose an ancestry and finalize your culture selections to unlock the next
                      step.
                    </p>
                  )}
                </article>

                <aside className="origin-aside">
                  <div className="sidebar-card">
                    <h3>Origin artwork</h3>
                    <div className="portrait-grid">
                      <div className="portrait-card">
                        <span className="label">Human cultures</span>
                        <p>{isHuman ? "Ready for human culture art." : "Select a human culture."}</p>
                      </div>
                      <div className="portrait-card">
                        <span className="label">Singer forms</span>
                        <p>{isSinger ? "Ready for singer form art." : "Select singer ancestry."}</p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            {isStep1Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 2 - Starting paths</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <div className="option-grid">
                    {heroicPaths.map((path) => (
                      <label
                        key={path.id}
                        className={`option-card${state.pathKey === path.id ? " active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="heroic-path"
                          value={path.id}
                          checked={state.pathKey === path.id}
                          onChange={(event) => handlePathChange(event.target.value)}
                        />
                        <span>
                          <strong>{path.name}</strong>
                          <span>{path.theme}</span>
                          <em>Starting skill: {path.startingSkill}</em>
                        </span>
                      </label>
                    ))}
                  </div>
                </article>
              </div>
            )}

            {isStep2Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 3 - Choose your attributes</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <div className="field-row">
                    <span className="field-label">Attribute points</span>
                    <span className="field-meta">
                      {attributePointsRemaining} remaining of {totalAttributePoints}
                    </span>
                  </div>
                  <p className="field-hint">
                    Distribute 12 points across Strength, Speed, Intellect, Willpower, Awareness,
                    and Presence. You cannot assign more than 3 points to any attribute during
                    character creation.
                  </p>
                  <div className="attribute-grid">
                    {attributeList.map((attribute) => {
                      const currentValue = state.attributes[attribute.key];
                      return (
                        <div key={attribute.key} className="attribute-card">
                          <span>
                            <strong>{attribute.label}</strong>
                          </span>
                          <div className="counter compact">
                            <button
                              className="ghost small"
                              type="button"
                              onClick={() => handleAttributeAdjust(attribute.key, -1)}
                              disabled={currentValue <= 0}
                            >
                              -
                            </button>
                            <span className="attribute-value">{currentValue}</span>
                            <button
                              className="primary small"
                              type="button"
                              onClick={() => handleAttributeAdjust(attribute.key, 1)}
                              disabled={currentValue >= maxAttributeScore || attributePointsRemaining <= 0}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="callout">
                    <p>Derived statistics (tracked from your attributes):</p>
                    <ul className="stat-list">
                      <li>
                        <strong>Lifting capacity:</strong> {derivedStats.liftingCapacity} lb
                      </li>
                      <li>
                        <strong>Movement rate:</strong> {derivedStats.movementRate}
                      </li>
                      <li>
                        <strong>Recovery die:</strong> {derivedStats.recoveryDie}
                      </li>
                      <li>
                        <strong>Senses range:</strong> {derivedStats.sensesRange}
                      </li>
                    </ul>
                  </div>
                </article>
              </div>
            )}

            {isStep3Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 4 - Choose your skills &amp; expertises</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <div className="field-group">
                    <div className="field-row">
                      <span className="field-label">Starting skill ranks</span>
                      <span className="field-meta">
                        {remainingSkillRanks} remaining of {baseSkillRanks}
                      </span>
                    </div>
                    <p className="field-hint">
                      Gain a free rank in your heroic path&apos;s starting skill, then distribute 4
                      additional ranks across the skills below. You can&apos;t increase any skill
                      above 2 ranks during character creation.
                    </p>
                    <div className="skill-grid">
                      {skills.map((skill) => {
                        const currentValue = state.skills[skill.id] ?? 0;
                        const isStartingSkill = skill.id === startingSkillId;
                        return (
                          <div key={skill.id} className="skill-row">
                            <span>
                              <strong>{skill.name}</strong>
                              <span className="field-meta">
                                {skill.category} • {skill.attribute}
                                {isStartingSkill ? " • Starting skill" : ""}
                              </span>
                            </span>
                            <div className="counter">
                              <button
                                className="ghost small"
                                type="button"
                                onClick={() => handleSkillAdjust(skill.id, -1)}
                                disabled={currentValue <= (isStartingSkill ? 1 : 0)}
                              >
                                -
                              </button>
                              <span className="field-label">{currentValue}</span>
                              <button
                                className="primary small"
                                type="button"
                                onClick={() => handleSkillAdjust(skill.id, 1)}
                                disabled={currentValue >= 2 || remainingSkillRanks <= 0}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!selectedPath && (
                      <p className="field-hint">Select a starting path to unlock your free rank.</p>
                    )}
                  </div>

                  <div className="field-group">
                    <div className="field-row">
                      <span className="field-label">Expertises</span>
                      <span className="field-meta">
                        {totalExpertisesChosen}/{maxAdditionalExpertises} additional
                      </span>
                    </div>
                    <p className="field-hint">
                      You already gained two expertises from culture. If your Intellect score is 1
                      or higher, choose additional expertises equal to that score.
                    </p>
                    <div className="expertise-list">
                      {state.cultureKeys.map((cultureId) => {
                        const culture = culturalExpertises.find((item) => item.id === cultureId);
                        if (!culture) {
                          return null;
                        }
                        return (
                          <span key={culture.id} className="expertise-pill locked">
                            {culture.name}
                          </span>
                        );
                      })}
                      {state.expertises.map((expertise) => (
                        <button
                          key={expertise}
                          className="expertise-pill"
                          type="button"
                          onClick={() => handleExpertiseRemove(expertise)}
                        >
                          {expertise} ✕
                        </button>
                      ))}
                    </div>
                    <div className="expertise-grid">
                      {availableExpertises.map((expertise) => (
                        <button
                          key={expertise}
                          className="expertise-option"
                          type="button"
                          onClick={() => handleExpertiseAdd(expertise)}
                          disabled={!canAddExpertise}
                        >
                          {expertise}
                        </button>
                      ))}
                    </div>
                    <div className="field-row">
                      <input
                        type="text"
                        value={expertiseInput}
                        onChange={(event) => setExpertiseInput(event.target.value)}
                        placeholder="Add an expertise"
                      />
                      <button
                        className="primary small"
                        type="button"
                        onClick={() => {
                          handleExpertiseAdd(expertiseInput);
                          setExpertiseInput("");
                        }}
                        disabled={!canAddExpertise || !expertiseInput.trim()}
                      >
                        Add
                      </button>
                    </div>
                    {!canAddExpertise && maxAdditionalExpertises > 0 && (
                      <p className="field-hint">
                        You have chosen all additional expertises for your current Intellect score.
                      </p>
                    )}
                    {maxAdditionalExpertises === 0 && (
                      <p className="field-hint">
                        Your Intellect score does not grant additional expertises in this step.
                      </p>
                    )}
                    {availableExpertises.length === 0 && canAddExpertise && (
                      <p className="field-hint">
                        All listed expertises are already selected—add a custom expertise below.
                      </p>
                    )}
                  </div>
                  {(remainingSkillRanks > 0 ||
                    maxAdditionalExpertises > totalExpertisesChosen) && (
                    <p className="field-hint">
                      To unlock the next step, spend {Math.max(0, remainingSkillRanks)} more skill
                      rank{remainingSkillRanks === 1 ? "" : "s"} and add{" "}
                      {Math.max(0, maxAdditionalExpertises - totalExpertisesChosen)} more expertise
                      {maxAdditionalExpertises - totalExpertisesChosen === 1 ? "" : "s"}.
                    </p>
                  )}
                </article>
              </div>
            )}

            {isStep4Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 5 - Choose your talents</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <p className="field-hint">
                    Add the talents you qualify for at level 1. Include ancestry or heroic path
                    talents as needed.
                  </p>
                  <div className="callout">
                    <strong>What these talents do</strong>
                    <p>
                      Your heroic path grants a key talent at level 1. Singer ancestry adds its own
                      key talent. Use the options below to add the appropriate key talent and any
                      extra talents your table allows.
                    </p>
                  </div>
                  <div className="talent-grid">
                    {selectedPathTalents.map((talent) => (
                      <div key={talent.id} className="talent-option">
                        <div>
                          <strong>{talent.name}</strong>
                          <p className="field-hint">{talent.rulesText}</p>
                        </div>
                        <button
                          className="primary small"
                          type="button"
                          onClick={() => handleTalentAdd(talent.name)}
                          disabled={state.talents.includes(talent.name)}
                        >
                          {state.talents.includes(talent.name) ? "Added" : "Add talent"}
                        </button>
                      </div>
                    ))}
                    {selectedPathTalents.length === 0 && (
                      <p className="field-hint">
                        Select a heroic path to see its key talent options.
                      </p>
                    )}
                  </div>
                  <div className="talent-summary">
                    {state.talents.length === 0 ? (
                      <p className="field-hint">No talents selected yet.</p>
                    ) : (
                      state.talents.map((talent) => (
                        <div key={talent} className="talent-card">
                          <strong>{talent}</strong>
                          <button
                            className="ghost small"
                            type="button"
                            onClick={() => handleTalentRemove(talent)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              </div>
            )}

            {isStep5Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 6 - Equip yourself</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <p className="field-hint">
                    Choose a starting kit, roll your starting spheres, and spend them on weapons,
                    armor, or additional equipment.
                  </p>
                  <div className="field-group">
                    <label className="field-label" htmlFor="starting-kit-select">
                      Starting kit
                    </label>
                    <select
                      id="starting-kit-select"
                      value={selectedKitId ?? ""}
                      onChange={(event) => handleKitSelect(event.target.value)}
                    >
                      <option value="">Select a kit</option>
                      {startingKits.map((kit) => (
                        <option key={kit.id} value={kit.id}>
                          {kit.name}
                        </option>
                      ))}
                    </select>
                    {selectedKit ? (
                      <ul className="purchase-list compact">
                        <li>
                          <span className="kit-detail-label">Weapons</span>
                          <span className="kit-detail-value">{selectedKit.weapons}</span>
                        </li>
                        <li>
                          <span className="kit-detail-label">Armor</span>
                          <span className="kit-detail-value">{selectedKit.armor}</span>
                        </li>
                        <li>
                          <span className="kit-detail-label">Equipment</span>
                          <span className="kit-detail-value">{selectedKit.equipment}</span>
                        </li>
                        <li>
                          <span className="kit-detail-label">Spheres</span>
                          <span className="kit-detail-value">{selectedKit.spheres}</span>
                        </li>
                        {selectedKit.additionalExpertise && (
                          <li>
                            <span className="kit-detail-label">Expertise bonus</span>
                            <span className="kit-detail-value">
                              {selectedKit.additionalExpertise}
                            </span>
                          </li>
                        )}
                        {selectedKit.connection && (
                          <li>
                            <span className="kit-detail-label">Connection</span>
                            <span className="kit-detail-value">{selectedKit.connection}</span>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="field-hint">Select a kit to view its starting items.</p>
                    )}
                  </div>
                  <div className="field-row">
                    <span className="field-label">Starting spheres</span>
                    <span className="field-meta">
                      {rolledSpheres === null
                        ? "Roll to determine your marks."
                        : `${rolledSpheres} marks`}
                    </span>
                  </div>
                  <div className="field-row">
                    <button
                      className="primary small"
                      type="button"
                      onClick={handleSphereRoll}
                      disabled={!selectedKitId}
                    >
                      Roll spheres
                    </button>
                    {remainingSpheres !== null && (
                      <span className="field-meta">Remaining: {remainingSpheres} marks</span>
                    )}
                  </div>
                  <div className="shop-grid">
                    <div>
                      <h3>Weapons</h3>
                      <ul className="purchase-list scroll">
                        {weaponItems.map((item) => (
                          <li key={item.name}>
                            <span>{item.name}</span>
                            <span>{item.price} mk</span>
                            <button
                              className="ghost small"
                              type="button"
                              onClick={() => handlePurchase(item)}
                              disabled={
                                !selectedKitId ||
                                rolledSpheres === null ||
                                (remainingSpheres !== null && remainingSpheres < item.price)
                              }
                            >
                              Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Armor</h3>
                      <ul className="purchase-list scroll">
                        {armorItems.map((item) => (
                          <li key={item.name}>
                            <span>{item.name}</span>
                            <span>{item.price} mk</span>
                            <button
                              className="ghost small"
                              type="button"
                              onClick={() => handlePurchase(item)}
                              disabled={
                                !selectedKitId ||
                                rolledSpheres === null ||
                                (remainingSpheres !== null && remainingSpheres < item.price)
                              }
                            >
                              Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Equipment</h3>
                      <ul className="purchase-list scroll">
                        {equipmentItems.map((item) => (
                          <li key={item.name}>
                            <span>{item.name}</span>
                            <span>{item.price} mk</span>
                            <button
                              className="ghost small"
                              type="button"
                              onClick={() => handlePurchase(item)}
                              disabled={
                                !selectedKitId ||
                                rolledSpheres === null ||
                                (remainingSpheres !== null && remainingSpheres < item.price)
                              }
                            >
                              Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="field-group">
                    <h3>Purchased items</h3>
                    <div className="inventory-list">
                      {purchasedItems.length === 0 ? (
                        <span className="field-hint">No purchases yet.</span>
                      ) : (
                        purchasedItems.map((item, index) => (
                          <button
                            key={`${item.name}-${index}`}
                            className="expertise-pill"
                            type="button"
                            onClick={() => handlePurchaseRemove(index)}
                          >
                            {item.name} ({item.price} mk) ✕
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="field-group">
                    <h3>Sphere values (diamond marks)</h3>
                    <ul className="purchase-list compact">
                      {sphereValues.map((value) => (
                        <li key={value.gemstone}>
                          <span>{value.gemstone}</span>
                          <span>
                            Chip {value.chip} • Mark {value.mark} • Broam {value.broam}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            )}

            {isStep6Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <h2>
                    <strong>Step 7 - Tell your story</strong>
                  </h2>
                </div>
                <article className="form-card">
                  <div className="field-group">
                    <label className="field-label" htmlFor="character-name">
                      Character name
                    </label>
                    <input
                      id="character-name"
                      type="text"
                      value={state.identity.name}
                      onChange={(event) => handleIdentityChange("name", event.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="player-name">
                      Player name
                    </label>
                    <input
                      id="player-name"
                      type="text"
                      value={state.identity.playerName}
                      onChange={(event) => handleIdentityChange("playerName", event.target.value)}
                      placeholder="Player"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="character-purpose">
                      Purpose &amp; motivation
                    </label>
                    <textarea
                      id="character-purpose"
                      rows={3}
                      value={state.identity.purpose}
                      onChange={(event) => handleIdentityChange("purpose", event.target.value)}
                      placeholder="What drives your character?"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="character-obstacle">
                      Obstacles
                    </label>
                    <textarea
                      id="character-obstacle"
                      rows={3}
                      value={state.identity.obstacle}
                      onChange={(event) => handleIdentityChange("obstacle", event.target.value)}
                      placeholder="What stands in their way?"
                    />
                  </div>
                  <div className="field-group">
                    <div className="field-row">
                      <span className="field-label">Goals</span>
                      <span className="field-meta">{state.identity.goals.length} listed</span>
                    </div>
                    <div className="goal-input">
                      <input
                        type="text"
                        value={goalInput}
                        onChange={(event) => setGoalInput(event.target.value)}
                        placeholder="Add a goal"
                      />
                      <button
                        className="primary small"
                        type="button"
                        onClick={() => {
                          handleGoalAdd(goalInput);
                          setGoalInput("");
                        }}
                        disabled={!goalInput.trim()}
                      >
                        Add
                      </button>
                    </div>
                    <div className="goal-list">
                      {state.identity.goals.map((goal) => (
                        <button
                          key={goal}
                          className="goal-pill"
                          type="button"
                          onClick={() => handleGoalRemove(goal)}
                        >
                          {goal} ✕
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="character-notes">
                      Notes
                    </label>
                    <textarea
                      id="character-notes"
                      rows={3}
                      value={state.identity.notes}
                      onChange={(event) => handleIdentityChange("notes", event.target.value)}
                      placeholder="Add any extra story details."
                    />
                  </div>
                </article>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

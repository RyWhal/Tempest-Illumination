import { useState } from "react";
import {
  ancestries,
  culturalExpertises,
  heroicPaths,
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

export default function App() {
  const [state, setState] = useState<CharacterState>(initialState);
  const [currentStep, setCurrentStep] = useState<"origin" | "origins">("origin");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [talentInput, setTalentInput] = useState("");
  const [inventoryInput, setInventoryInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  const selectedAncestry = ancestries.find((ancestry) => ancestry.id === state.ancestryKey);
  const selectedPath = heroicPaths.find((path) => path.id === state.pathKey);
  const startingSkill = skills.find((skill) => skill.name === selectedPath?.startingSkill);
  const startingSkillId = startingSkill?.id;

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
      cultureKeys: value === "sl.ancestry.human" ? prev.cultureKeys : []
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

  const handleInventoryAdd = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      return;
    }
    setState((prev) => {
      if (prev.inventory.includes(cleaned)) {
        return prev;
      }
      return { ...prev, inventory: [...prev.inventory, cleaned] };
    });
  };

  const handleInventoryRemove = (value: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((item) => item !== value)
    }));
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
  const isStep6Complete = isStep5Complete && state.inventory.length > 0;

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
                <span className="step-index">Step 1</span>
                <h2>Ancestry &amp; culture</h2>
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
                    </div>
                  ) : (
                    <div className="field-group">
                      <div className="field-row">
                        <label className="field-label">Cultural expertises</label>
                        <span className="field-meta">{state.cultureKeys.length}/2 selected</span>
                      </div>
                      <div className="callout">
                        <p>
                          Your character’s culture isn’t determined by birth or any other single
                          moment in time. Instead, cultural awareness can be shaped by nationality,
                          ethnicity, migration, traveling experience, and more.
                        </p>
                        <span className="field-meta">Player Handbook p. 38</span>
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
                  <span className="step-index">Step 2</span>
                  <h2>Starting paths</h2>
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
                  <span className="step-index">Step 3</span>
                  <h2>Choose your attributes</h2>
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
                            <span className="field-meta">{currentValue}</span>
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
                    <p>
                      Record any derived statistics from your attributes, such as lifting capacity,
                      movement rate, recovery die, and senses range, after you distribute your
                      points.
                    </p>
                    <span className="field-meta">Player Handbook p. 44</span>
                  </div>
                </article>
              </div>
            )}

            {isStep3Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <span className="step-index">Step 4</span>
                  <h2>Choose your skills &amp; expertises</h2>
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
                  </div>
                </article>
              </div>
            )}

            {isStep4Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <span className="step-index">Step 5</span>
                  <h2>Choose your talents</h2>
                </div>
                <article className="form-card">
                  <p className="field-hint">
                    Add the talents you qualify for at level 1. Include ancestry or heroic path
                    talents as needed.
                  </p>
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
                  <div className="field-row">
                    <input
                      type="text"
                      value={talentInput}
                      onChange={(event) => setTalentInput(event.target.value)}
                      placeholder="Add a talent"
                    />
                    <button
                      className="primary small"
                      type="button"
                      onClick={() => {
                        handleTalentAdd(talentInput);
                        setTalentInput("");
                      }}
                      disabled={!talentInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                </article>
              </div>
            )}

            {isStep5Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <span className="step-index">Step 6</span>
                  <h2>Equip yourself</h2>
                </div>
                <article className="form-card">
                  <p className="field-hint">
                    Record your starting kit, signature gear, and any important items.
                  </p>
                  <div className="inventory-list">
                    {state.inventory.length === 0 ? (
                      <span className="field-hint">No gear added yet.</span>
                    ) : (
                      state.inventory.map((item) => (
                        <button
                          key={item}
                          className="expertise-pill"
                          type="button"
                          onClick={() => handleInventoryRemove(item)}
                        >
                          {item} ✕
                        </button>
                      ))
                    )}
                  </div>
                  <div className="field-row">
                    <input
                      type="text"
                      value={inventoryInput}
                      onChange={(event) => setInventoryInput(event.target.value)}
                      placeholder="Add equipment"
                    />
                    <button
                      className="primary small"
                      type="button"
                      onClick={() => {
                        handleInventoryAdd(inventoryInput);
                        setInventoryInput("");
                      }}
                      disabled={!inventoryInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                </article>
              </div>
            )}

            {isStep6Complete && (
              <div className="origin-step">
                <div className="card-header">
                  <span className="step-index">Step 7</span>
                  <h2>Tell your story</h2>
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

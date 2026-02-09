# Stormlight Pack Data

This directory contains Stormlight RPG setting data split into type-specific JSON files. Each file follows the **setting pack** shape defined in `docs/cosmere_setting_pack.schema.v1.json`:

```json
{
  "pack": { "id": "...", "type": "setting_pack", "name": "...", "setting": "stormlight", "version": "...", "source_pdf": "..." },
  "records": [ { "id": "...", "type": "...", "name": "...", "setting": "stormlight", "source": { "pdf": "...", "page": 0 } } ]
}
```

## Data Sources

- Records and citations are derived from the curated dataset in `docs/stormlight_pack.initial.v1.json`, which was assembled from the **Stormlight Handbook Digital.pdf** source file.
- `heroic_path.json` uses heroic key talent citations as anchor references and summarizes heroic path metadata from the handbook’s "Heroic Paths at a Glance" table.
- `culture.json` mirrors the cultural expertise coverage in the curated dataset; additional cultures (e.g., Natan, Reshi) should be added once cited in the handbook dataset.
- `item.json` and `kit.json` currently include starter samples and should be expanded as additional item lists are curated.
- Placeholder datasets have been created for character-sheet categories (attributes, defenses, resources, conditions, injuries, actions, goals, connections, spren, ideals, etc.) so tooling can evolve without needing to create new files later.

> **Note:** Files such as `radiant_order.json`, `surge.json`, `heroic_path.json`, `culture.json`, `attribute.json`, `spren.json`, and `ideal.json` intentionally extend the schema with new `type` values to support downstream tooling. These records still mirror the same field structure (including `source`, `rules_text`, and `prerequisites`).

## Record Field Guide

- `id`: Stable identifier, namespaced by setting.
- `type`: Record category (`ancestry`, `skill`, `cultural_expertise`, `talent`, `item`, `kit`, `rule_module`, plus extensions like `radiant_order`, `surge`, `heroic_path`, `culture`, `attribute`, `defense`, `resource`, `condition`, `injury`, `action`, `goal`, `connection`, `spren`, `ideal`, `movement`, `sense`, `recovery`, `mark`, `appearance`, `purpose`, `advancement`, `ability`, `weapon`, `armor`, `equipment`, `expertise`).
- `subtype`: Optional subtype for further grouping (ex: `radiant_key`).
- `name`: Display name.
- `setting`: Setting slug (use `stormlight`).
- `source`: Citation object with `pdf` and `page`.
- `rules_text`: The rules description to display to players.
- `prerequisite_text`: Human-readable prerequisite summary.
- `activation_text`: Activation/usage summary (for talents and actions).
- `prerequisites`: Machine-readable prerequisites (see below).
- `grants`: Structured output for unlocks, items, or derived effects.
- `attribute`, `category`, `size`, `path`, `radiant_order`, `tags`: Optional domain fields that align with the schema.
- `theme`, `specialties`, `starting_skill`, `key_talent_id`, `key_talent_summary`, `related_expertise_id`: Domain-specific metadata used by `heroic_path` and `culture` records.

## Prerequisite Encoding

Prerequisites use a lightweight boolean tree. Each object **must** include `type`, with optional typed fields (such as `min_level` or `talent_id`). Use nested `any_of`, `all_of`, or `not` to compose complex requirements.

Example: the `Windrunner Surge Access` rule module encodes multiple requirements by nesting an `all_of` inside the `prerequisites` array:

```json
"prerequisites": [
  {
    "type": "all_of",
    "all_of": [
      { "type": "level", "min_level": 2 },
      { "type": "talent", "talent_id": "sl.talent.radiant.windrunner_first_ideal_key" }
    ]
  }
]
```

This structure allows tooling to evaluate prerequisites deterministically while keeping `prerequisite_text` as the narrative-facing summary.

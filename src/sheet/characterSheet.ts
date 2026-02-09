import { CharacterData } from "../models/character";
import { computeDerivedStats } from "../utils/derivedStats";

export interface CharacterSheetSummary {
  name: string;
  origins: string;
  path: string;
  derivedStats: ReturnType<typeof computeDerivedStats>;
  equippedItems: string[];
}

export const buildCharacterSheetSummary = (
  character: CharacterData,
): CharacterSheetSummary => {
  const origins = [
    character.origins.homeland,
    character.origins.culture,
    character.origins.background,
  ]
    .filter(Boolean)
    .join(" • ");

  const path = [character.path.order, character.path.calling]
    .filter(Boolean)
    .join(" • ");

  return {
    name: character.name,
    origins: origins || "Unassigned origins",
    path: path || "Unassigned path",
    derivedStats: computeDerivedStats(character.attributes),
    equippedItems: character.equipment.items,
  };
};

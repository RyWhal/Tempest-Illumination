import { AttributesData, DerivedStats } from "../models/character";

export const computeDerivedStats = (attributes: AttributesData): DerivedStats => {
  const vitality = attributes.might * 2 + attributes.willpower;
  const resolve = attributes.willpower * 2 + attributes.intellect;
  const focus = attributes.intellect * 2 + attributes.charisma;
  const initiative = attributes.agility + attributes.intellect;

  return {
    vitality,
    resolve,
    focus,
    initiative,
  };
};

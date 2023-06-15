import type { Character } from "@slippi/slippi-js";
import type { ComboFilterSettings } from "@vinceau/slp-realtime";
import { getCharacterName } from "@vinceau/slp-realtime";

interface PerCharPercentObject {
  [characterId: number]: number;
}

export interface CharPercentOption {
  character: Character;
  percent: number;
}

export interface ComboConfiguration extends Omit<ComboFilterSettings, "perCharacterMinComboPercent"> {
  perCharMinComboPercents: CharPercentOption[];
}

export const mapConfigurationToFilterSettings = (config: Partial<ComboConfiguration>): Partial<ComboFilterSettings> => {
  const { perCharMinComboPercents, ...rest } = config;
  if (!perCharMinComboPercents) {
    return config;
  }

  return {
    ...rest,
    perCharacterMinComboPercent: mapCharacterPercentArrayToObject(perCharMinComboPercents),
  };
};

export const mapFilterSettingsToConfiguration = (
  settings: Partial<ComboFilterSettings>
): Partial<ComboConfiguration> => {
  const { perCharacterMinComboPercent, ...rest } = settings;
  if (!perCharacterMinComboPercent) {
    return settings;
  }

  return {
    ...rest,
    perCharMinComboPercents: mapObjectToCharacterPercentArray(perCharacterMinComboPercent),
  };
};

export const mapCharacterPercentArrayToObject = (percents?: CharPercentOption[]): PerCharPercentObject => {
  const newValue = {};
  if (!percents) {
    percents = [];
  }
  percents.forEach((c: CharPercentOption) => {
    if (c) {
      newValue[c.character] = c.percent;
    }
  });
  return newValue;
};

export const mapObjectToCharacterPercentArray = (charPercents: PerCharPercentObject): CharPercentOption[] => {
  const percentArray: CharPercentOption[] = [];
  for (const [key, value] of Object.entries(charPercents)) {
    percentArray.push({
      character: parseInt(key, 10),
      percent: value as number,
    });
  }
  percentArray.sort((a, b) => {
    const aName = getCharacterName(a.character);
    const bName = getCharacterName(b.character);
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
  return percentArray;
};

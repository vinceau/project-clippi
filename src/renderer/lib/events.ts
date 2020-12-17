import log from "electron-log";
import {
  ComboEvent,
  ComboEventFilter,
  EventConfig,
  GameEvent,
  InputEvent,
  StockEvent,
  StockEventFilter,
} from "@vinceau/slp-realtime";
import { CustomInputEventFilter, generateButtonComboPreview } from "./inputs";

export const generateEventName = (event: EventConfig): string => {
  try {
    switch (event.type) {
      case GameEvent.GAME_START:
        return "When the game starts";
      case GameEvent.GAME_END:
        return "When the game ends";
      case ComboEvent.END:
        return generateComboEventName("combo", event);
      case ComboEvent.CONVERSION:
        return generateComboEventName("conversion", event);
      case InputEvent.BUTTON_COMBO:
        return generateButtonComboEventName(event);
      case StockEvent.PLAYER_SPAWN:
        return generateStockEventName("spawns", event);
      case StockEvent.PLAYER_DIED:
        return generateStockEventName("dies", event);
    }
  } catch (err) {
    log.error(err);
  }
  return event.type;
};

const generatePlayerText = (players?: string | number | number[]): [string, number] => {
  if (!players) {
    return ["a player", 4];
  }
  if (typeof players === "string") {
    return [players, 1];
  }
  if (typeof players === "number") {
    return [`P${players + 1}`, 1];
  }

  return [players.map((i) => `P${i + 1}`).join(", "), players.length];
};

const generateComboEventName = (comboOrConversion: string, event: EventConfig) => {
  const filter = event.filter as ComboEventFilter;
  const players = filter ? filter.playerIndex : undefined;
  const [playerText, numPlayers] = generatePlayerText(players);
  const profileName = (filter.comboCriteria as string).substring(1);
  const profileText = profileName === "default" ? comboOrConversion : `${profileName} ${comboOrConversion}`;
  if (numPlayers === 4) {
    return `When a ${profileText} occurs`;
  }
  return `When ${playerText} does a ${profileText}`;
};

const generateStockEventName = (spawnOrDies: string, event: EventConfig): string => {
  const players = event.filter ? (event.filter as StockEventFilter).playerIndex : undefined;
  const [playerText, numPlayers] = generatePlayerText(players);
  if (numPlayers === 4) {
    return `When a player ${spawnOrDies}`;
  }
  return `When ${playerText} ${spawnOrDies}`;
};

const generateButtonComboEventName = (event: EventConfig): string => {
  const filter = event.filter as CustomInputEventFilter;
  const buttons = generateButtonComboPreview(filter.buttonCombo, ", ");
  const holdText = filter.inputButtonHold === "held" ? "holds" : "presses";
  const [playerText] = generatePlayerText(filter.playerIndex);

  let holdInfo = "";
  if (filter.inputButtonHold === "held") {
    holdInfo = ` for ${filter.inputButtonHoldDelay} ${filter.inputButtonHoldUnits}`;
  }

  return `When ${playerText} ${holdText} ${buttons}${holdInfo}`;
};

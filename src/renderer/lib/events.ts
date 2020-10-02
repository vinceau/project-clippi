import {
  ComboEvent,
  ComboEventFilter,
  EventConfig,
  GameEvent,
  InputEvent,
  StockEvent,
  StockEventFilter,
} from "@vinceau/slp-realtime";
import { CustomInputEventFilter } from "./inputs";

const randomEvents: string[] = [
  "Wizzrobe lands a grab",
  "Zain misses a pivot",
  "n0ne does something sick",
  "the wind blows",
  "you feeling kinda cute",
  "you feel so tired but you can't sleep",
  "nobody laughs at your joke",
  "you try your best but you don't succeed",
  "Jesus returns",
  "Natalie Tran makes a lamington video",
  "Hungrybox lands a rest",
  "you get what you want but not what you need",
  "someone says that Melee is a dead game",
  "aMSa wins a major",
  "you get left on read",
  "Shippiddge releases Starter Squad 10",
];

export const generateRandomEvent = () => {
  const d = new Date();
  // Start at current day + month
  const offset = d.getDate() + d.getMonth();
  // If the current hour is odd, add one, else minus one
  const switcher = d.getHours() % 2 ? 1 : -1;
  const index = (offset + switcher) % randomEvents.length;
  return randomEvents[index] + "...";
};

export const generateEventName = (event: EventConfig): string => {
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
    default:
      return "";
  }
};

const generateComboEventName = (comboOrConversion: string, event: EventConfig) => {
  const filter = event.filter as ComboEventFilter;
  const players = filter.playerIndex as number[];
  const numPlayers = players.length;
  const profileName = (filter.comboCriteria as string).substring(1);
  const profileText = profileName === "default" ? comboOrConversion : `${profileName} ${comboOrConversion}`;
  if (numPlayers === 4) {
    return `When a ${profileText} occurs`;
  }
  const playerText = players.map((i) => `P${i + 1}`).join(", ");
  return `When ${playerText} does a ${profileText}`;
};

const generateStockEventName = (spawnOrDies: string, event: EventConfig): string => {
  const players = (event.filter as StockEventFilter).playerIndex as number[];
  const numPlayers = players.length;
  if (numPlayers === 4) {
    return `When a player ${spawnOrDies}`;
  }
  const playerText = players.map((i) => `P${i + 1}`).join(", ");
  return `When ${playerText} ${spawnOrDies}`;
};

const generateButtonComboEventName = (event: EventConfig): string => {
  const filter = event.filter as CustomInputEventFilter;
  const buttons = filter.buttonCombo.join(", ");
  const isOrAre = filter.buttonCombo.length > 1 ? "are" : "is";

  let holdText: string = filter.inputButtonHold;
  const numPlayers = filter.playerIndex.length;
  const playerText = filter.playerIndex.map((i) => `P${i + 1}`).join(", ");

  let holdInfo = "";
  if (filter.inputButtonHold === "held") {
    holdInfo = `for ${filter.inputButtonHoldDelay} ${filter.inputButtonHoldUnits}`;
    if (numPlayers !== 4 && numPlayers > 1) {
      holdText = "holds";
    }
  } else {
    if (numPlayers > 1) {
      holdText = "presses";
    }
  }

  if (numPlayers === 4) {
    return `When ${buttons} ${isOrAre} ${holdText} ${holdInfo}`;
  }

  return `When ${playerText} ${holdText} ${buttons} ${holdInfo}`;
};

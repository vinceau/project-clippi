import type { ComboFilterSettings } from "@vinceau/slp-realtime";

export type PlayerIndexFilter = number | number[] | string;

export enum ComboEvent {
  START = "combo-start", // Emitted at the start of a combo
  EXTEND = "combo-extend", // Emitted at the extension of a combo
  END = "combo-occurred", // Emitted at the end of a combo
  CONVERSION = "conversion-occurred", // Emitted at the end of a conversion
}

export enum GameEvent {
  GAME_START = "game-start",
  GAME_END = "game-end",
}

export enum InputEvent {
  BUTTON_COMBO = "button-combo",
}

export enum StockEvent {
  PLAYER_SPAWN = "player-spawn",
  PLAYER_DIED = "player-died",
}

export interface ComboEventFilter {
  playerIndex?: PlayerIndexFilter;
  comboCriteria?: string | Partial<ComboFilterSettings>;
}

export interface GameStartEventFilter {
  isTeams?: boolean;
  numPlayers?: number;
}

export interface GameEndEventFilter {
  winnerPlayerIndex?: PlayerIndexFilter;
  endMethod?: number;
}

export type GameEventFilter = GameStartEventFilter | GameEndEventFilter;

export interface InputEventFilter {
  combo: string[];
  duration?: number;
  playerNames?: string[];
  playerIndex?: PlayerIndexFilter;
  fuzzyNameMatch?: boolean;
}

export interface StockEventFilter {
  playerIndex?: PlayerIndexFilter;
}

export type EventFilter = ComboEventFilter | GameEventFilter | InputEventFilter | StockEventFilter;

export interface EventConfig {
  id: string;
  type: string;
  filter?: EventFilter;
}

export type EventManagerVariables = Partial<{
  playerIndex: number;
}> &
  Record<string, any>;

export interface EventManagerConfig {
  variables?: EventManagerVariables;
  events: EventConfig[];
}

export interface EventEmit {
  id: string;
  type: string;
  payload?: any;
}

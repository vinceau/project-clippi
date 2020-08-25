import * as path from "path";

import formatter from "formatter";
import moment, { Moment } from "moment";

import { Context } from "@vinceau/event-actions";

import {
  ComboType,
  GameEndMethod,
  GameEndType,
  GameStartType,
  getCharacterColorName,
  getCharacterName,
  getCharacterShortName,
  getStageName,
  getStageShortName,
  StockType,
  Metadata,
} from "@vinceau/slp-realtime";
import { sanitizeFilename } from "./utils";

const exampleFilename = "Game_20190323T111317.slp";

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":2,"players":[{"playerIndex":0,"port":1,"characterId":0,"characterColor":3,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":"BORT"},{"playerIndex":2,"port":3,"characterId":25,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":"YORT"}]}`;
export const exampleGameStart: GameStartType = JSON.parse(gameStartString);

const gameEndString = `{"gameEndMethod":2,"lrasInitiatorIndex":-1}`;
export const exampleGameEnd: GameEndType = JSON.parse(gameEndString);

const spawnString = `{"playerIndex":0,"opponentIndex":2,"startFrame":2688,"endFrame":null,"startPercent":0,"endPercent":null,"currentPercent":0,"count":3,"deathAnimation":null}`;
export const exampleSpawnStockType: StockType = JSON.parse(spawnString);
const deathString = `{"playerIndex":2,"opponentIndex":0,"startFrame":-123,"endFrame":2378,"startPercent":0,"endPercent":149.62828063964844,"currentPercent":149.62828063964844,"count":4,"deathAnimation":4}`;
export const exampleDeathStockType: StockType = JSON.parse(deathString);
const comboString = `{"playerIndex":0,"opponentIndex":2,"startFrame":7146,"endFrame":7739,"startPercent":0,"currentPercent":95.0999984741211,"endPercent":95.0999984741211,"moves":[{"frame":7146,"moveId":13,"hitCount":1,"damage":12},{"frame":7169,"moveId":21,"hitCount":1,"damage":8},{"frame":7222,"moveId":21,"hitCount":1,"damage":7.279998779296875},{"frame":7326,"moveId":13,"hitCount":1,"damage":11.15999984741211},{"frame":7380,"moveId":17,"hitCount":1,"damage":11.520000457763672},{"frame":7407,"moveId":8,"hitCount":1,"damage":9},{"frame":7451,"moveId":21,"hitCount":1,"damage":7.120002746582031},{"frame":7554,"moveId":16,"hitCount":1,"damage":10},{"frame":7625,"moveId":17,"hitCount":1,"damage":11.279998779296875},{"frame":7714,"moveId":17,"hitCount":1,"damage":7.739997863769531}],"didKill":true}`;
export const exampleComboType: ComboType = JSON.parse(comboString);

export const generateGameStartContext = (
  gameStart: GameStartType,
  context?: Context,
  index?: number,
  metadata?: Metadata
): Context => {
  const numPlayers = gameStart.players.length;
  let ctx: Context = {
    numPlayers,
  };
  const stageId = gameStart.stageId;
  if (stageId) {
    ctx.stage = getStageName(stageId);
    ctx.shortStage = getStageShortName(stageId);
  }
  ctx = genPlayerOpponentContext(gameStart, ctx, index, metadata);
  return Object.assign(ctx, context);
};

export const generateGameEndContext = (gameEnd: GameEndType, context?: Context): Context => {
  const ctx: Context = {};
  if (gameEnd.lrasInitiatorIndex !== null) {
    ctx.quitterPort = getQuitterPort(gameEnd.lrasInitiatorIndex);
  }
  if (gameEnd.gameEndMethod !== null) {
    ctx.endMethod = getGameEndMethod(gameEnd.gameEndMethod);
  }
  return Object.assign(ctx, context);
};

const getQuitterPort = (index: number): number => {
  if (index === -1) {
    return -1;
  }
  return index + 1;
};

const getGameEndMethod = (method: GameEndMethod): string => {
  switch (method) {
    case GameEndMethod.GAME:
      return "Game";
    case GameEndMethod.TIME:
      return "Time";
    case GameEndMethod.NO_CONTEST:
      return "No contest";
    default:
      return "Unknown";
  }
};

export const generateStockContext = (stock: StockType, settings: GameStartType, context?: Context): Context => {
  const ctx: Context = generateGameStartContext(settings, {}, stock.playerIndex);
  ctx.count = stock.count;
  ctx.startFrame = stock.startFrame;
  ctx.endFrame = stock.endFrame;
  ctx.startPercent = stock.startPercent;
  ctx.endPercent = stock.endPercent;
  return Object.assign(ctx, context);
};

export const generateComboContext = (combo: ComboType, settings: GameStartType, context?: Context): Context => {
  const ctx: Context = generateGameStartContext(settings, {}, combo.playerIndex);
  ctx.comboMovesTotal = combo.moves.length;
  ctx.comboDidKill = combo.didKill ? "killed" : "did not kill";
  if (combo.endPercent !== null && combo.endPercent !== undefined) {
    ctx.comboPercent = Math.round(combo.endPercent - combo.startPercent);
  } else {
    console.error("Could not calculate combo percent");
  }
  return Object.assign(ctx, context);
};

const genPlayerContext = (
  index: number,
  settings: GameStartType,
  metadata?: Metadata
): {
  netplayName: string | null;
  netplayCode: string | null;
  tag: string | null;
  port: number;
  char: string;
  shortChar: string;
  color: string;
} | null => {
  const player = settings.players.find((p) => p.playerIndex === index);
  if (!player) {
    throw new Error(`Could not find player with index: ${index}`);
  }
  const playerCharId = player.characterId;
  const playerCharColor = player.characterColor;

  // Determine netplay names if they exist
  let netplayName = null;
  let netplayCode = null;
  if (metadata && metadata.players) {
    const playerInfo = metadata.players[index];
    if (playerInfo && playerInfo.names) {
      const names = playerInfo.names;
      netplayName = names.netplay ? sanitizeFilename(playerInfo.names.netplay, "_") : null;
      netplayCode = names.code ? sanitizeFilename(playerInfo.names.code, "_") : null;
    }
  }

  if (playerCharId !== null && playerCharColor !== null) {
    return {
      netplayName,
      netplayCode,
      tag: player.nametag,
      port: player.port,
      char: getCharacterName(playerCharId),
      shortChar: getCharacterShortName(playerCharId),
      color: getCharacterColorName(playerCharId, playerCharColor),
    };
  }
  return null;
};

const genPlayerOpponentContext = (
  gameStart: GameStartType,
  context?: Context,
  index?: number,
  metadata?: Metadata
): Context => {
  const numPlayers = gameStart.players.length;
  const ctx: Context = {};
  if (numPlayers === 2) {
    const playerIndex = index !== undefined ? index : gameStart.players[0].playerIndex;
    let opponentIndex = gameStart.players.map((p) => p.playerIndex).find((i) => i !== playerIndex);
    if (opponentIndex === undefined) {
      opponentIndex = gameStart.players[1].playerIndex;
    }
    const playerContext = genPlayerContext(playerIndex, gameStart, metadata);
    const opponentContext = genPlayerContext(opponentIndex, gameStart, metadata);
    if (playerContext !== null) {
      ctx.player = `P${playerContext.port}`;
      ctx.playerTag = playerContext.tag;
      ctx.playerPort = playerContext.port;
      ctx.playerChar = playerContext.char;
      ctx.playerShortChar = playerContext.shortChar;
      ctx.playerColor = playerContext.color;
      ctx.playerName = playerContext.netplayName;
      ctx.playerCode = playerContext.netplayCode;
    }
    if (opponentContext !== null) {
      ctx.opponent = `P${opponentContext.port}`;
      ctx.opponentTag = opponentContext.tag;
      ctx.opponentPort = opponentContext.port;
      ctx.opponentChar = opponentContext.char;
      ctx.opponentShortChar = opponentContext.shortChar;
      ctx.opponentColor = opponentContext.color;
      ctx.opponentName = opponentContext.netplayName;
      ctx.opponentCode = opponentContext.netplayCode;
    }
  }
  return Object.assign(ctx, context);
};

const momentSnippets = [
  "YYYY", // full year (2020)
  "YY", // short year (20)
  "MM", // month (01)
  "MMM", // short month (Jan)
  "MMMM", // full month (January)
  "DD", // day (18)
  "ddd", // short day (Sat)
  "dddd", // full day (Saturday)
  "HH", // 24-hour (18)
  "hh", // 12-hour (06)
  "mm", // minute (33)
  "ss", // seconds (54)
  "a", // lower case (am/pm)
  "A", // lower case (AM/PM)
];

export const generateGlobalContext = (context?: Context, date?: Moment): Context => {
  const m = date ? date : moment();
  const d = m.toDate();
  const newContext = {
    date: sanitizeFilename(d.toLocaleDateString()),
    time: sanitizeFilename(d.toLocaleTimeString()),
  };
  for (const snip of momentSnippets) {
    newContext[snip] = m.local().format(snip);
  }
  return Object.assign(newContext, context);
};

const addFilenameContext = (context?: Context, filename?: string): Context => {
  const name = filename ? filename : exampleFilename;
  const onlyExt = path.extname(name);
  const fullFilename = path.basename(name);
  const onlyFilename = path.basename(name, onlyExt);
  const newContext = {
    filename: onlyFilename,
    fullFilename,
    fileExt: onlyExt,
  };
  return Object.assign(newContext, context);
};

export const generateFileRenameContext = (
  settings?: GameStartType,
  metadata?: Metadata,
  filename?: string
): Context => {
  const gameStart = settings ? settings : exampleGameStart;
  let ctx = generateGameStartContext(gameStart, undefined, undefined, metadata);
  const gameStartTime = metadata && metadata.startAt ? metadata.startAt : undefined;
  ctx = generateGlobalContext(ctx, moment(gameStartTime));
  ctx = addFilenameContext(ctx, filename);
  return ctx;
};

export const parseFileRenameFormat = (
  format: string,
  settings?: GameStartType,
  metadata?: Metadata,
  filename?: string
): string => {
  const ctx = generateFileRenameContext(settings, metadata, filename);
  const msgFormatter = formatter(format);
  return msgFormatter(ctx);
};

import * as path from "path";

import formatter from "formatter";
import moment, { Moment } from "moment";

import { Context } from "@vinceau/event-actions";

import {
    ComboType, GameEndMethod, GameEndType, GameStartType,
    getCharacterColorName, getCharacterName, getCharacterShortName, getStageName, getStageShortName, StockType
} from "@vinceau/slp-realtime";

const exampleFilename = "Game_20190323T111317.slp";

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":31,"players":[{"playerIndex":0,"port":1,"characterId":20,"characterColor":0,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":""},{"playerIndex":1,"port":2,"characterId":2,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":""}]}`;
export const exampleGameStart: GameStartType = JSON.parse(gameStartString);

const gameEndString = `{"gameEndMethod":2,"lrasInitiatorIndex":-1}`;
export const exampleGameEnd: GameEndType = JSON.parse(gameEndString);

const spawnString = `{"playerIndex":0,"opponentIndex":1,"startFrame":2688,"endFrame":null,"startPercent":0,"endPercent":null,"currentPercent":0,"count":3,"deathAnimation":null}`;
export const exampleSpawnStockType: StockType = JSON.parse(spawnString);
const deathString = `{"playerIndex":1,"opponentIndex":0,"startFrame":-123,"endFrame":2378,"startPercent":0,"endPercent":149.62828063964844,"currentPercent":149.62828063964844,"count":4,"deathAnimation":4}`;
export const exampleDeathStockType: StockType = JSON.parse(deathString);
const comboString = `{"playerIndex":0,"opponentIndex":1,"startFrame":7146,"endFrame":7739,"startPercent":0,"currentPercent":95.0999984741211,"endPercent":95.0999984741211,"moves":[{"frame":7146,"moveId":13,"hitCount":1,"damage":12},{"frame":7169,"moveId":21,"hitCount":1,"damage":8},{"frame":7222,"moveId":21,"hitCount":1,"damage":7.279998779296875},{"frame":7326,"moveId":13,"hitCount":1,"damage":11.15999984741211},{"frame":7380,"moveId":17,"hitCount":1,"damage":11.520000457763672},{"frame":7407,"moveId":8,"hitCount":1,"damage":9},{"frame":7451,"moveId":21,"hitCount":1,"damage":7.120002746582031},{"frame":7554,"moveId":16,"hitCount":1,"damage":10},{"frame":7625,"moveId":17,"hitCount":1,"damage":11.279998779296875},{"frame":7714,"moveId":17,"hitCount":1,"damage":7.739997863769531}],"didKill":true}`;
export const exampleComboType: ComboType = JSON.parse(comboString);

export const generateGameStartContext = (gameStart: GameStartType, context?: Context, index?: number): Context => {
    const numPlayers = gameStart.players.length;
    let ctx: Context = {
        numPlayers,
    };
    const stageId = gameStart.stageId;
    if (stageId) {
        ctx.stage = getStageName(stageId);
        ctx.shortStage = getStageShortName(stageId);
    }
    ctx = genPlayerOpponentContext(gameStart, ctx, index);
    return Object.assign(ctx, context);
};

export const generateGameEndContext = (gameEnd: GameEndType, context?: Context): Context => {
    console.log(gameEnd);
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
    console.log(stock);
    const ctx: Context = generateGameStartContext(settings, {}, stock.playerIndex);
    ctx.count = stock.count;
    return Object.assign(ctx, context);
};

export const generateComboContext = (combo: ComboType, settings: GameStartType, context?: Context): Context => {
    console.log(combo);
    const ctx: Context = generateGameStartContext(settings, {}, combo.playerIndex);
    ctx.comboMovesTotal = combo.moves.length;
    ctx.comboDidKill = combo.didKill ? "killed" : "did not kill";
    console.log(combo.endPercent);
    console.log(combo.startPercent);
    if (combo.endPercent !== null && combo.endPercent !== undefined) {
        ctx.comboPercent = Math.round(combo.endPercent - combo.startPercent);
        console.log(ctx.comboPercent);
    } else {
        console.log("could not calculate combo percent");
    }
    return Object.assign(ctx, context);
};

const genPlayerContext = (index: number, settings: GameStartType): {
    tag: string | null;
    port: number;
    char: string;
    shortChar: string;
    color: string;
} | null => {
    console.log(`generating player context with id ${index}`);
    console.log("settings:");
    console.log(settings);
    const player = settings.players.find(p => p.playerIndex === index);
    if (!player) {
        throw new Error(`Could not find player with index: ${index}`);
    }
    const playerCharId = player.characterId;
    const playerCharColor = player.characterColor;
    if (playerCharId !== null && playerCharColor !== null) {
        return {
            tag: player.nametag,
            port: player.port,
            char: getCharacterName(playerCharId),
            shortChar: getCharacterShortName(playerCharId),
            color: getCharacterColorName(playerCharId, playerCharColor),
        };
    }
    return null;
};

const genPlayerOpponentContext = (gameStart: GameStartType, context?: Context, index?: number): Context => {
    const numPlayers = gameStart.players.length;
    const ctx: Context = {};
    if (numPlayers === 2) {
        const playerIndex = index !== undefined ? index : gameStart.players[0].playerIndex;
        let opponentIndex = gameStart.players.map(p => p.playerIndex).find((i) => i !== playerIndex);
        if (opponentIndex === undefined) {
            opponentIndex = gameStart.players[1].playerIndex;
        }
        const playerContext = genPlayerContext(playerIndex, gameStart);
        const opponentContext = genPlayerContext(opponentIndex, gameStart);
        if (playerContext !== null) {
            ctx.playerTag = playerContext.tag;
            ctx.playerPort = playerContext.port;
            ctx.playerChar = playerContext.char;
            ctx.playerShortChar = playerContext.shortChar;
            ctx.playerColor = playerContext.color;
        }
        if (opponentContext !== null) {
            ctx.opponentTag = opponentContext.tag;
            ctx.opponentPort = opponentContext.port;
            ctx.opponentChar = opponentContext.char;
            ctx.opponentShortChar = opponentContext.shortChar;
            ctx.opponentColor = opponentContext.color;
        }
    }
    return Object.assign(ctx, context);
};

const momentSnippets = [
    "YYYY", // full year (2020)
    "YY",   // short year (20)
    "MM",   // month (01)
    "MMM",  // short month (Jan)
    "MMMM", // full month (January)
    "DD",   // day (18)
    "ddd",  // short day (Sat)
    "dddd", // full day (Saturday)
    "HH",   // 24-hour (18)
    "hh",   // 12-hour (06)
    "mm",   // minute (33)
    "ss",   // seconds (54)
    "a",    // lower case (am/pm)
    "A",    // lower case (AM/PM)
];

export const generateGlobalContext = (context?: Context, date?: Moment): Context => {
    const m = date ? date : moment();
    const d = m.toDate();
    const newContext = {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
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

export const parseFileRenameFormat = (format: string, settings?: GameStartType, metadata?: any, filename?: string): string => {
    console.log(`format: ${format}`);
    console.log(`filename: ${filename}`);
    const gameStart = settings ? settings : exampleGameStart;
    let ctx = generateGameStartContext(gameStart);
    const gameStartTime = metadata && metadata.startAt ? metadata.startAt : undefined;
    ctx = generateGlobalContext(ctx, moment(gameStartTime));
    ctx = addFilenameContext(ctx, filename);
    const msgFormatter = formatter(format);
    return msgFormatter(ctx);
};

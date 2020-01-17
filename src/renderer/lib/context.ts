import { Context } from "@vinceau/event-actions";
import { GameStartType, getCharacterColorName, getCharacterName, getCharacterShortName,
    getStageName, getStageShortName, GameEndMethod, GameEndType, StockType } from "@vinceau/slp-realtime";

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":31,"players":[{"playerIndex":0,"port":1,"characterId":20,"characterColor":0,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":""},{"playerIndex":1,"port":2,"characterId":2,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":""}]}`;
export const exampleGameStart: GameStartType = JSON.parse(gameStartString);

const gameEndString = `{"gameEndMethod":2,"lrasInitiatorIndex":-1}`;
export const exampleGameEnd: GameEndType = JSON.parse(gameEndString);

const spawnString = `{"playerIndex":0,"opponentIndex":1,"startFrame":2688,"endFrame":null,"startPercent":0,"endPercent":null,"currentPercent":0,"count":3,"deathAnimation":null}`;
export const exampleSpawnStockType: StockType = JSON.parse(spawnString);
const deathString = `{"playerIndex":1,"opponentIndex":0,"startFrame":-123,"endFrame":2378,"startPercent":0,"endPercent":149.62828063964844,"currentPercent":149.62828063964844,"count":4,"deathAnimation":4}`;
export const exampleDeathStockType: StockType = JSON.parse(deathString);

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
}

export const generateStockContext = (stock: StockType, settings: GameStartType, context?: Context): Context => {
    console.log(stock);
    const ctx: Context = generateGameStartContext(settings, {}, stock.playerIndex);
    ctx.count = stock.count;
    return Object.assign(ctx, context);
};

const genPlayerContext = (index: number, settings: GameStartType): {
    tag: string | null;
    port: number;
    char: string;
    shortChar: string;
    color: string;
} | null => {
    const player = settings.players[index];
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
        const playerIndex = index !== undefined ? index : 0;
        let opponentIndex = gameStart.players.map(p => p.playerIndex).find((i) => i !== playerIndex);
        if (opponentIndex === undefined) {
            opponentIndex = 1;
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
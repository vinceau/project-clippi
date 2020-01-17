import { Context } from "@vinceau/event-actions";
import { GameStartType, getCharacterColorName, getCharacterName, getCharacterShortName, getStageName, getStageShortName, GameEndMethod, GameEndType } from "@vinceau/slp-realtime";

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":31,"players":[{"playerIndex":0,"port":1,"characterId":20,"characterColor":0,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":""},{"playerIndex":1,"port":2,"characterId":2,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":""}]}`;
export const exampleGameStart: GameStartType = JSON.parse(gameStartString);

export const generateGameStartContext = (gameStart: GameStartType, context?: Context): Context => {
    const numPlayers = gameStart.players.length;
    const ctx: Context = {
        numPlayers,
    };
    const stageId = gameStart.stageId;
    if (stageId) {
        ctx.stage = getStageName(stageId);
        ctx.shortStage = getStageShortName(stageId);
    }
    if (numPlayers === 2) {
        const player = gameStart.players[0];
        const opponent = gameStart.players[1];
        const playerCharId = player.characterId;
        const playerCharColor = player.characterColor;
        const opponentCharId = opponent.characterId;
        const opponentCharColor = opponent.characterColor;
        if (playerCharId !== null && playerCharColor !== null) {
            ctx.playerTag = player.nametag;
            ctx.playerPort = player.port;
            ctx.playerChar = getCharacterName(playerCharId);
            ctx.playerShortChar = getCharacterShortName(playerCharId);
            ctx.playerColor = getCharacterColorName(playerCharId, playerCharColor);
        }
        if (opponentCharId !== null && opponentCharColor !== null) {
            ctx.opponentTag = opponent.nametag;
            ctx.opponentPort = opponent.port;
            ctx.opponentChar = getCharacterName(opponentCharId);
            ctx.opponentShortChar = getCharacterShortName(opponentCharId);
            ctx.opponentColor = getCharacterColorName(opponentCharId, opponentCharColor);
        }
    }
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

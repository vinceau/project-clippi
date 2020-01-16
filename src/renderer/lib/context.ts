import { Context } from "@vinceau/event-actions";
import { GameStartType, getCharacterColorName, getCharacterName, getStageName } from "@vinceau/slp-realtime";

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":31,"players":[{"playerIndex":0,"port":1,"characterId":20,"characterColor":0,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":""},{"playerIndex":1,"port":2,"characterId":2,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":""}]}`;
export const exampleGameStart: GameStartType = JSON.parse(gameStartString);

export const generateGameStartContext = (gameStart: GameStartType): Context => {
    console.log(gameStart);
    const numPlayers = gameStart.players.length;
    const ctx: Context = {
        numPlayers,
    };
    const stageId = gameStart.stageId;
    if (stageId) {
        ctx.stage = getStageName(stageId);
    }
    if (numPlayers === 2) {
        const player = gameStart.players[0];
        const opponent = gameStart.players[1];
        const playerCharId = player.characterId;
        const playerCharColor = player.characterColor;
        const opponentCharId = opponent.characterId;
        const opponentCharColor = opponent.characterColor;
        console.log(playerCharId);
        console.log(playerCharColor);
        console.log(opponentCharId);
        console.log(opponentCharColor);
        if (playerCharId !== null && playerCharColor !== null) {
            ctx.playerTag = player.nametag;
            ctx.playerPort = player.port;
            ctx.playerChar = getCharacterName(playerCharId);
            ctx.playerColor = getCharacterColorName(playerCharId, playerCharColor);
        }
        if (opponentCharId !== null && opponentCharColor !== null) {
            ctx.opponentTag = opponent.nametag;
            ctx.opponentPort = opponent.port;
            ctx.opponentChar = getCharacterName(opponentCharId);
            ctx.opponentColor = getCharacterColorName(opponentCharId, opponentCharColor);
        }
    }
    console.log(`Returning context:`);
    console.log(ctx);
    return ctx;
};

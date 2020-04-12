import { Action, Context } from "@vinceau/event-actions";
import { ComboFilter, ConnectionStatus, SlpFolderStream, SlpLiveStream, SlpRealTime } from "@vinceau/slp-realtime";
import { withLatestFrom } from "rxjs/operators";

import { dispatcher } from "@/store";
import { eventActionManager } from "../actions";
import { exampleComboType, exampleDeathStockType, exampleGameEnd, exampleGameStart, exampleSpawnStockType,
        generateComboContext, generateGameEndContext, generateGameStartContext, generateGlobalContext, generateStockContext } from "common/context";
import { isDevelopment, notify } from "./utils";

export enum ActionEvent {
    GAME_START = "game-start",
    GAME_END = "game-end",
    PLAYER_SPAWN = "player-spawn",
    PLAYER_DIED = "player-died",
    COMBO_OCCURRED = "combo-occurred",
    CONVERSION_OCCURRED = "conversion-occurred",
    TEST_EVENT = "test-event",
}

const errorHandler = (err: any) => {
    console.error(err);
    notify("Error occurred!");
};

export const comboFilter = new ComboFilter();
if (isDevelopment) {
    comboFilter.updateSettings({ excludeCPUs: false, comboMustKill: false, minComboPercent: 40 });
}

const slippiRealtime = new SlpRealTime();

slippiRealtime.game.start$.subscribe(gameStart => {
    const ctx = generateGameStartContext(gameStart);
    eventActionManager.emitEvent(ActionEvent.GAME_START, generateGlobalContext(ctx)).catch(errorHandler);
});
slippiRealtime.game.end$.subscribe(gameEnd => {
    const ctx = generateGameEndContext(gameEnd);
    eventActionManager.emitEvent(ActionEvent.GAME_END, generateGlobalContext(ctx)).catch(errorHandler);
});

slippiRealtime.stock.playerSpawn$.pipe(
    withLatestFrom(slippiRealtime.game.start$),
).subscribe(([stock, settings]) => {
    const ctx = generateStockContext(stock, settings);
    eventActionManager.emitEvent(ActionEvent.PLAYER_SPAWN, generateGlobalContext(ctx)).catch(errorHandler);
});

slippiRealtime.stock.playerDied$.pipe(
    withLatestFrom(slippiRealtime.game.start$),
).subscribe(([stock, settings]) => {
    const ctx = generateStockContext(stock, settings);
    eventActionManager.emitEvent(ActionEvent.PLAYER_DIED, generateGlobalContext(ctx)).catch(errorHandler);
});

slippiRealtime.combo.end$.subscribe((payload) => {
    const { combo, settings } = payload;
    if (comboFilter.isCombo(combo, settings)) {
        const ctx = generateComboContext(combo, settings);
        eventActionManager.emitEvent(ActionEvent.COMBO_OCCURRED, generateGlobalContext(ctx)).catch(errorHandler);
    }
});

slippiRealtime.combo.conversion$.subscribe(payload => {
    const { combo, settings } = payload;
    if (comboFilter.isCombo(combo, settings)) {
        const ctx = generateComboContext(combo, settings);
        eventActionManager.emitEvent(ActionEvent.CONVERSION_OCCURRED, generateGlobalContext(ctx)).catch(errorHandler);
    }
});

export const testRunActions = (event: string, actions: Action[]): void => {
    console.log(`testing ${event} event`);
    let ctx: Context = {};
    switch (event) {
        case ActionEvent.GAME_START:
            ctx = generateGameStartContext(exampleGameStart);
            break;
        case ActionEvent.GAME_END:
            ctx = generateGameEndContext(exampleGameEnd);
            break;
        case ActionEvent.PLAYER_SPAWN:
            ctx = generateStockContext(exampleSpawnStockType, exampleGameStart);
            break;
        case ActionEvent.PLAYER_DIED:
            ctx = generateStockContext(exampleDeathStockType, exampleGameStart);
            break;
        case ActionEvent.COMBO_OCCURRED:
        case ActionEvent.CONVERSION_OCCURRED:
            ctx = generateComboContext(exampleComboType, exampleGameStart);
            break;
    }
    eventActionManager.execute(actions, generateGlobalContext(ctx)).catch(console.error);
};

class SlpStreamManager {
    private stream: SlpLiveStream | SlpFolderStream | null = null;

    public async connectToSlippi(port?: number): Promise<void> {
        console.log(`attempt to connect to slippi on port: ${port}`);
        const address = "0.0.0.0";
        const slpPort = port ? port : 1667;
        const stream = new SlpLiveStream();
        stream.connection.on("statusChange", (status) => {
            dispatcher.tempContainer.setSlippiConnectionStatus(status);
            if (status === ConnectionStatus.CONNECTED) {
                notify("Connected to Slippi relay");
            } else if (status === ConnectionStatus.DISCONNECTED) {
                notify("Disconnected from Slippi relay");
            }
        });
        console.log(stream.connection);
        await stream.start(address, slpPort);
        slippiRealtime.setStream(stream);
        this.stream = stream;
    }

    public disconnectFromSlippi(): void {
        if (this.stream && "connection" in this.stream) {
            this.stream.connection.disconnect();
        }
        this.stream = null;
    }

    public async monitorSlpFolder(filepath: string): Promise<void> {
        try {
            const stream = new SlpFolderStream();
            await stream.start(filepath);
            slippiRealtime.setStream(stream);
            this.stream = stream;
            dispatcher.tempContainer.setSlpFolderStream(filepath);
        } catch (err) {
            console.error(err);
            notify("Could not monitor folder. Are you sure it exists?");
        }
    }

    public stopMonitoringSlpFolder(): void {
        if (this.stream && "stop" in this.stream) {
            this.stream.stop();
        }
        this.stream = null;
        dispatcher.tempContainer.clearSlpFolderStream();
    }
}

export const streamManager = new SlpStreamManager();

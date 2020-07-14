import { Action, Context } from "@vinceau/event-actions";
import {
  ComboFilter,
  ConnectionStatus,
  SlpFolderStream,
  SlpLiveStream,
  SlpRealTime,
  EventManager,
  EventManagerConfig,
} from "@vinceau/slp-realtime";
import { withLatestFrom } from "rxjs/operators";

import { dispatcher } from "@/store";
import {
  exampleComboType,
  exampleDeathStockType,
  exampleGameEnd,
  exampleGameStart,
  exampleSpawnStockType,
  generateComboContext,
  generateGameEndContext,
  generateGameStartContext,
  generateGlobalContext,
  generateStockContext,
} from "common/context";
import { isDevelopment } from "common/utils";
import { eventActionManager } from "../containers/actions";
import { notify } from "./utils";

/*
export enum ActionEvent {
  GAME_START = "game-start",
  GAME_END = "game-end",
  PLAYER_SPAWN = "player-spawn",
  PLAYER_DIED = "player-died",
  COMBO_OCCURRED = "combo-occurred",
  CONVERSION_OCCURRED = "conversion-occurred",
}

const errorHandler = (err: any) => {
  console.error(err);
  notify("Unexpected error occurred!");
};

export const comboFilter = new ComboFilter();
if (isDevelopment) {
  comboFilter.updateSettings({ excludeCPUs: false, comboMustKill: false, minComboPercent: 40 });
}

// const slippiRealtime = new SlpRealTime();

slippiRealtime.game.start$.subscribe(async (gameStart) => {
  try {
    const ctx = generateGameStartContext(gameStart);
    await eventActionManager.emitEvent(ActionEvent.GAME_START, generateGlobalContext(ctx));
  } catch (err) {
    errorHandler(err);
  }
});

slippiRealtime.game.end$.subscribe(async (gameEnd) => {
  try {
    const ctx = generateGameEndContext(gameEnd);
    await eventActionManager.emitEvent(ActionEvent.GAME_END, generateGlobalContext(ctx));
  } catch (err) {
    errorHandler(err);
  }
});

slippiRealtime.stock.playerSpawn$
  .pipe(withLatestFrom(slippiRealtime.game.start$))
  .subscribe(async ([stock, settings]) => {
    try {
      const ctx = generateStockContext(stock, settings);
      await eventActionManager.emitEvent(ActionEvent.PLAYER_SPAWN, generateGlobalContext(ctx));
    } catch (err) {
      errorHandler(err);
    }
  });

slippiRealtime.stock.playerDied$
  .pipe(withLatestFrom(slippiRealtime.game.start$))
  .subscribe(async ([stock, settings]) => {
    try {
      const ctx = generateStockContext(stock, settings);
      await eventActionManager.emitEvent(ActionEvent.PLAYER_DIED, generateGlobalContext(ctx));
    } catch (err) {
      errorHandler(err);
    }
  });

slippiRealtime.combo.end$.subscribe(async (payload) => {
  const { combo, settings } = payload;
  try {
    if (comboFilter.isCombo(combo, settings)) {
      const ctx = generateComboContext(combo, settings);
      await eventActionManager.emitEvent(ActionEvent.COMBO_OCCURRED, generateGlobalContext(ctx));
    }
  } catch (err) {
    errorHandler(err);
  }
});

slippiRealtime.combo.conversion$.subscribe(async (payload) => {
  const { combo, settings } = payload;
  try {
    if (comboFilter.isCombo(combo, settings)) {
      const ctx = generateComboContext(combo, settings);
      await eventActionManager.emitEvent(ActionEvent.CONVERSION_OCCURRED, generateGlobalContext(ctx));
    }
  } catch (err) {
    errorHandler(err);
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
*/

class SlpStreamManager {
  private stream: SlpLiveStream | SlpFolderStream | null = null;
  private realtime: SlpRealTime;
  private eventManager: EventManager;

  public constructor() {
    this.realtime = new SlpRealTime();
    this.eventManager = new EventManager(this.realtime);
    this.eventManager.events$.subscribe((event) => {
      eventActionManager.emitEvent(event.id);
    });
  }

  public updateEventConfig(config: EventManagerConfig) {
    console.log("using config:");
    console.log(config);
    this.eventManager.updateConfig(config);
  }

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
    this.realtime.setStream(stream);
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
      this.realtime.setStream(stream);
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

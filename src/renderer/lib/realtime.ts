import {
  ConnectionStatus,
  SlpFolderStream,
  SlpLiveStream,
  SlpRealTime,
  EventManager,
  EventManagerConfig,
} from "@vinceau/slp-realtime";

import { dispatcher } from "@/store";
import { eventActionManager } from "../containers/actions";
import { notify } from "./utils";

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

  public testRunEvent(eventId: string) {
    eventActionManager.emitEvent(eventId);
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

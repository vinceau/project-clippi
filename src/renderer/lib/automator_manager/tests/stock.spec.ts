import { SlpStreamMode } from "@slippi/slippi-js";
import { pipeFileContents, RxSlpStream, SlpRealTime } from "@vinceau/slp-realtime";
import type { Subscription } from "rxjs";
import sinon from "sinon";

import { EventManager } from "../eventManager";
import type { EventManagerConfig } from "../types";

describe("stock config", () => {
  let subscriptions: Array<Subscription>;

  beforeAll(() => {
    subscriptions = [];
  });

  afterAll(() => {
    subscriptions.forEach((s) => s.unsubscribe());
  });

  it("can correctly track stock spawn and death events", async () => {
    const playerSpawnSpy = sinon.spy();
    const playerDeathSpy = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    realtime.setStream(slpStream);

    const config: EventManagerConfig = {
      events: [
        {
          id: "player-spawn-id",
          type: "player-spawn",
        },
        {
          id: "player-death-id",
          type: "player-died",
        },
      ],
    };

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "player-spawn-id":
            playerSpawnSpy();
            break;
          case "player-death-id":
            playerDeathSpy();
            break;
        }
      })
    );

    eventManager.updateConfig(config);

    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    expect(playerSpawnSpy.callCount).toEqual(8);
    expect(playerDeathSpy.callCount).toEqual(7);
  });
});

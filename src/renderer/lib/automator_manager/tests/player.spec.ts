import { SlpStreamMode } from "@slippi/slippi-js";
import { pipeFileContents, RxSlpStream, SlpRealTime } from "@vinceau/slp-realtime";
import type { Subscription } from "rxjs";
import sinon from "sinon";

import { EventManager } from "../eventManager";
import type { EventManagerConfig } from "../types";

describe("player variables config", () => {
  let subscriptions: Array<Subscription>;

  beforeAll(() => {
    subscriptions = [];
  });

  afterAll(() => {
    subscriptions.forEach((s) => s.unsubscribe());
  });

  it("can match the player index filter using variables", async () => {
    const playerSpy1 = sinon.spy();
    const opponentSpy1 = sinon.spy();
    const playerSpy2 = sinon.spy();
    const opponentSpy2 = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    realtime.setStream(slpStream);

    const config: EventManagerConfig = {
      variables: {
        playerIndex: 0,
      },
      events: [
        {
          id: "player-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: "player",
          },
        },
        {
          id: "opponents-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: "opponents",
          },
        },
      ],
    };

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "player-button-combo":
            playerSpy1();
            break;
          case "opponents-button-combo":
            opponentSpy1();
            break;
        }
      })
    );

    eventManager.updateConfig(config);

    // P1 vs P4
    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream, { end: false });

    expect(playerSpy1.callCount).toEqual(22);
    expect(opponentSpy1.callCount).toEqual(26);

    const newConfig: EventManagerConfig = {
      variables: {
        playerIndex: 3,
      },
      events: [
        {
          id: "player-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: "player",
          },
        },
        {
          id: "opponent-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: "opponents",
          },
        },
      ],
    };

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "player-button-combo":
            playerSpy2();
            break;
          case "opponent-button-combo":
            opponentSpy2();
            break;
        }
      })
    );

    eventManager.updateConfig(newConfig);

    slpStream.restart();
    // P1 vs P4
    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    expect(playerSpy2.callCount).toEqual(26);
    expect(opponentSpy2.callCount).toEqual(22);
  });
});

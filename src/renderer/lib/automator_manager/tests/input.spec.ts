import { SlpStreamMode } from "@slippi/slippi-js";
import { pipeFileContents, RxSlpStream, SlpRealTime } from "@vinceau/slp-realtime";
import type { Subscription } from "rxjs";
import sinon from "sinon";

import { EventManager } from "../eventManager";
import type { EventManagerConfig } from "../types";

describe("input config", () => {
  let subscriptions: Array<Subscription>;

  beforeAll(() => {
    subscriptions = [];
  });

  afterAll(() => {
    subscriptions.forEach((s) => s.unsubscribe());
  });

  // This test does not pass yet because we don't actually know where to best throw/catch
  // so we'll just skip it for now
  // it.skip("should throw when an invalid input is given", () => {
  //   const realtime = new SlpRealTime();
  //   const eventManager = new EventManager(realtime);
  //   eventManager.updateConfig({
  //     events: [
  //       {
  //         id: "anything",
  //         type: "button-combo",
  //         filter: {
  //           combo: ["23723fsehkf"],
  //           playerIndex: 0,
  //         },
  //       },
  //     ],
  //   });
  //   expect(() => eventManager.events$.subscribe()).toThrow();
  // });

  it("can match the player index filter", async () => {
    const p1Spy = sinon.spy();
    const p2Spy = sinon.spy();
    const p3Spy = sinon.spy();
    const p4Spy = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    realtime.setStream(slpStream);

    const config: EventManagerConfig = {
      events: [
        {
          id: "p1-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: 0,
          },
        },
        {
          id: "p2-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: 1,
          },
        },
        {
          id: "p3-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: 2,
          },
        },
        {
          id: "p4-button-combo",
          type: "button-combo",
          filter: {
            combo: ["A"],
            playerIndex: 3,
          },
        },
      ],
    };

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "p1-button-combo":
            p1Spy();
            break;
          case "p2-button-combo":
            p2Spy();
            break;
          case "p3-button-combo":
            p3Spy();
            break;
          case "p4-button-combo":
            p4Spy();
            break;
        }
      })
    );

    eventManager.updateConfig(config);

    // P1 vs P4
    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    expect(p1Spy.callCount).toEqual(22);
    expect(p2Spy.callCount).toEqual(0);
    expect(p3Spy.callCount).toEqual(0);
    expect(p4Spy.callCount).toEqual(26);
  });

  it("can find the correct number of combos", async () => {
    const buttonPresses = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    realtime.setStream(slpStream);

    const config: EventManagerConfig = {
      events: [
        {
          id: "x-button-combo",
          type: "button-combo",
          filter: {
            combo: ["X"],
          },
        },
      ],
    };

    subscriptions.push(
      eventManager.events$.subscribe((_event) => {
        buttonPresses();
      })
    );

    eventManager.updateConfig(config);

    // P1 vs P4
    await pipeFileContents("slp/button-combination-test.slp", slpStream);

    expect(buttonPresses.callCount).toEqual(2);
  });
});

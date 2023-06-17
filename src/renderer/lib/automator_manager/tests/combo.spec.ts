import { Character, SlpStreamMode } from "@slippi/slippi-js";
import { pipeFileContents, RxSlpStream, SlpRealTime } from "@vinceau/slp-realtime";
import type { Subscription } from "rxjs";
import sinon from "sinon";

import { EventManager } from "../eventManager";
import type { EventManagerConfig } from "../types";
import { ComboEvent } from "../types";

describe("combo config", () => {
  let subscriptions: Array<Subscription>;

  beforeAll(() => {
    subscriptions = [];
  });

  afterAll(() => {
    subscriptions.forEach((s) => s.unsubscribe());
  });

  it("correctly matches default combo config criteria", async () => {
    const allComboSpy = sinon.spy();
    const comboSpy = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    realtime.setStream(slpStream);

    const config: EventManagerConfig = {
      events: [
        {
          id: "combo-end-id",
          type: ComboEvent.END,
          filter: {
            comboCriteria: "none",
          },
        },
        {
          id: "combo-match-id",
          type: ComboEvent.END,
        },
      ],
    };

    eventManager.updateConfig(config);

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "combo-end-id":
            allComboSpy();
            break;
          case "combo-match-id":
            comboSpy();
            break;
        }
      })
    );

    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    expect(allComboSpy.callCount).toEqual(42);
    // We should have exactly 1 combo that matched the criteria
    expect(comboSpy.callCount).toEqual(1);
  });

  it("can filter by character", async () => {
    const bowserOnlySpy = sinon.spy();

    const excludesBowserSpy = sinon.spy();

    const config: EventManagerConfig = {
      variables: {
        $onlyBowser: { characterFilter: [Character.BOWSER] },
        $onlyFalcon: { characterFilter: [Character.CAPTAIN_FALCON] },
      },
      events: [
        {
          id: "only-bowser-events",
          type: ComboEvent.END,
          filter: {
            comboCriteria: "$onlyBowser",
          },
        },
        {
          id: "only-falcon-events",
          type: ComboEvent.END,
          filter: {
            comboCriteria: "$onlyFalcon",
          },
        },
      ],
    };
    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    realtime.setStream(slpStream);
    const eventManager = new EventManager(realtime);
    eventManager.updateConfig(config);

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "only-bowser-events":
            bowserOnlySpy();
            break;
          case "only-falcon-events":
            excludesBowserSpy();
            break;
        }
      })
    );

    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    expect(bowserOnlySpy.callCount).toEqual(0);
    expect(excludesBowserSpy.callCount).toEqual(1);
  });

  it("can filter by min combo percent config", async () => {
    const comboSpy = sinon.spy();

    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    eventManager.updateConfig({
      events: [
        {
          id: "min-combo-event",
          type: ComboEvent.END,
          filter: {
            comboCriteria: { minComboPercent: 20 },
          },
        },
      ],
    });
    realtime.setStream(slpStream);

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "min-combo-event":
            comboSpy();
            break;
        }
      })
    );

    await pipeFileContents("slp/Game_20190810T162904.slp", slpStream);

    // We should have exactly 3 combos that matched the criteria
    expect(comboSpy.callCount).toEqual(3);
  });

  it("emits the correct number of conversions", async () => {
    const conversionSpy = sinon.spy();
    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });
    const realtime = new SlpRealTime();
    const eventManager = new EventManager(realtime);
    eventManager.updateConfig({
      events: [
        {
          id: "min-combo-event",
          type: ComboEvent.CONVERSION,
          filter: {
            comboCriteria: { minComboPercent: 20 },
          },
        },
      ],
    });
    realtime.setStream(slpStream);
    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "min-combo-event":
            conversionSpy();
            break;
        }
      })
    );
    await pipeFileContents("slp/Game_20190324T113942.slp", slpStream);
    expect(conversionSpy.callCount).toEqual(7);
  });

  it("can support latest patreon build files", async () => {
    const comboSpy = sinon.spy();

    const filename = "slp/200306_2258_Falco_v_Fox_PS.slp";
    const slpStream = new RxSlpStream({ mode: SlpStreamMode.MANUAL });

    const realtime = new SlpRealTime();
    realtime.setStream(slpStream);
    const eventManager = new EventManager(realtime);
    eventManager.updateConfig({
      events: [
        {
          id: "min-combo-event",
          type: ComboEvent.CONVERSION,
          filter: {
            comboCriteria: { minComboPercent: 50 },
          },
        },
      ],
    });

    subscriptions.push(
      eventManager.events$.subscribe((event) => {
        switch (event.id) {
          case "min-combo-event":
            comboSpy();
            break;
        }
      })
    );
    await pipeFileContents(filename, slpStream);
    expect(comboSpy.callCount).toEqual(2);
  });
});

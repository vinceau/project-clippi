import type { Context } from "../action";
import { EventManager } from "../action";
import { AddCustom, AddFive, AddOne, AddToContext, AddTogether, AddTwo, DivByTwo, SubOne } from "./testActions";

describe("action events", () => {
  it("correctly calculates result for a single action", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-one", AddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: 1,
    });
    expect(res.result).toBe(2);
    res = await mgr.emitEvent(eventName, {
      result: 2,
    });
    expect(res.result).toBe(3);
    res = await mgr.emitEvent(eventName, {
      result: 3,
    });
    expect(res.result).toBe(4);
  });

  it("should return NaN if no context was given to the transforming action", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-one", AddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    const res: Context = await mgr.emitEvent(eventName, {});
    expect(res.result).toBeNaN();
  });

  it("correctly chains transforming actions", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-one", AddOne);
    mgr.registerAction("add-two", AddTwo);
    mgr.registerAction("add-five", AddFive);
    mgr.registerAction("sub-one", SubOne);

    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    mgr.registerEvent(eventName, {
      name: "add-two",
    });
    mgr.registerEvent(eventName, {
      name: "add-five",
    });
    mgr.registerEvent(eventName, {
      name: "sub-one",
    });
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: 2,
    });
    expect(res.result).toBe(9);
    res = await mgr.emitEvent(eventName, {
      result: 3,
    });
    expect(res.result).toBe(10);
    res = await mgr.emitEvent(eventName, {
      result: 4,
    });
    expect(res.result).toBe(11);
  });

  it("can take more than one argument", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("div-by-two", DivByTwo);
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    mgr.registerEvent(eventName, {
      name: "div-by-two",
    });
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: [2, 2],
    });
    expect(res.result).toBe(2);
    res = await mgr.emitEvent(eventName, {
      result: [2, 6],
    });
    expect(res.result).toBe(4);
  });

  it("can add custom", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 10,
    });
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: [2, 2],
    });
    expect(res.result).toBe(19);
    res = await mgr.emitEvent(eventName, {
      result: [1, 4],
    });
    expect(res.result).toBe(20);
  });

  it("can execute arbitrary actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const actionsList = [
      {
        name: "add-together",
      },
      {
        name: "add-custom",
        args: 5,
      },
      {
        name: "add-custom",
        args: 10,
      },
    ];
    let res: Context;
    res = await mgr.execute(actionsList, {
      result: [2, 2],
    });
    expect(res.result).toBe(19);
    res = await mgr.execute(actionsList, {
      result: [1, 4],
    });
    expect(res.result).toBe(20);
  });

  it("cannot remove non-existent actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    expect(mgr.removeEventAction(eventName, 1)).toBe(false);
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    expect(mgr.removeEventAction(eventName, 1)).toBe(false);
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    expect(mgr.removeEventAction(eventName, 1)).toBe(true);
  });

  it("can remove actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 10,
    });
    expect(mgr.removeEventAction(eventName, 2)).toBe(true);
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: [2, 2],
    });
    expect(res.result).toBe(9);
    res = await mgr.emitEvent(eventName, {
      result: [1, 4],
    });
    expect(res.result).toBe(10);
  });

  it("can deserialize event actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    const jsonString = `{"testEvent":[{"name":"add-together","transform":true},{"name":"add-custom","transform":true,"args":5},{"name":"add-custom","transform":true,"args":10}]}`;
    mgr.deserialize(jsonString);
    let res: Context;
    res = await mgr.emitEvent(eventName, {
      result: [2, 2],
    });
    expect(res.result).toBe(19);
    res = await mgr.emitEvent(eventName, {
      result: [1, 4],
    });
    expect(res.result).toBe(20);
  });

  it("can write things to the context", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-context", AddToContext);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-context",
      args: 123,
    });
    const beforeContext: Context = {
      foo: "bar",
    };
    const afterContext: Context = await mgr.emitEvent(eventName, beforeContext);
    expect(afterContext.foo).toBe("bar"); // the old context value should still be there
    expect(afterContext.added).toBe(123); // the new context value should be added
  });
});

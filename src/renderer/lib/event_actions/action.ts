export type Action = {
  name: string;
  args?: any;
};

export type Context = Record<string, any>;
export type EventActions = {
  [event: string]: Action[];
};

export type ActionType = (ctx: Context) => Promise<Context>;
export type ActionTypeGenerator = (args?: any) => ActionType;

export class EventManager {
  public eventActions: EventActions = {};
  private allActions = new Map<string, ActionTypeGenerator>();

  public registerAction(actionName: string, action: ActionTypeGenerator): void {
    this.allActions.set(actionName, action);
  }

  public listRegisteredActions(): string[] {
    return Array.from(this.allActions.keys());
  }

  public async emitEvent(eventName: string, context?: Context): Promise<Context> {
    const ctx: Context = Object.assign({}, context);
    const eventActions = this.eventActions[eventName];
    if (!eventActions || eventActions.length === 0) {
      return ctx;
    }
    return this.execute(eventActions, ctx);
  }

  /**
   * Execute a the given list of actions using the provided arguments.
   *
   * @param {Action[]} eventActions The list of actions to be executed
   * @param {...any[]} args The arguments to start the action chain with
   * @returns {Promise<any>} The value at the end of the chain
   * @memberof EventManager
   */
  public async execute(eventActions: Action[], context?: Context): Promise<Context> {
    let ctx: Context = Object.assign({}, context);
    for (const a of eventActions) {
      const action = this.allActions.get(a.name);
      // Skip if it doesn't exist
      if (!action) {
        continue;
      }
      const actionFunc = action(a.args);
      ctx = await actionFunc(ctx);
    }
    return ctx;
  }

  public getActions(eventName: string): Action[] {
    const actions = this.eventActions[eventName] || [];
    // Return a copy
    return Array.from(actions);
  }

  /**
   * Removes the action for an event at the given index
   *
   * @param {string} eventName The name of the event
   * @param {number} index The index of the action to be removed
   * @returns {boolean} Whether the removal was successful
   * @memberof EventManager
   */
  public removeEventAction(eventName: string, index: number): boolean {
    const list = this.eventActions[eventName];
    if (!list) {
      return false;
    }
    const res = list.splice(index, 1);
    return res.length > 0;
  }

  public setEventActions(eventName: string, actions: Action[]): void {
    this.eventActions[eventName] = actions;
  }

  public registerEvent(eventName: string, action: Action): void {
    let existingEvents = this.eventActions[eventName];
    if (!existingEvents) {
      existingEvents = [];
    }
    existingEvents.push(action);
    this.eventActions[eventName] = existingEvents;
  }

  public serialize(): string {
    return JSON.stringify(this.eventActions);
  }

  public deserialize(jsonStr: string): void {
    this.eventActions = JSON.parse(jsonStr);
  }
}

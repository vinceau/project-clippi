import type { ActionTypeGenerator, Context } from "../action";
import { delay } from "../utils";

/*
A transforming action. Takes the result of the last action
and adds one to it.
*/
export const AddOne: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 1,
    };
  };
};

/*
Adds the first two items of the result together.
Result is assumed to be a list.
*/
export const AddTogether: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(500);
    return {
      ...ctx,
      result: ctx.result[0] + ctx.result[1],
    };
  };
};

/*
A transforming action that takes the result and divides it by two
*/
export const DivByTwo: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result / 2,
    };
  };
};

export const SubOne: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(300);
    return {
      ...ctx,
      result: ctx.result - 1,
    };
  };
};

export const AddTwo: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 2,
    };
  };
};

export const AddFive: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 5,
    };
  };
};

/*
A transforming action that adds a custom number to the result.
*/
export const AddCustom: ActionTypeGenerator = (amount: number) => {
  return async (ctx: Context): Promise<Context> => {
    await delay(100);
    return {
      ...ctx,
      result: ctx.result + amount,
    };
  };
};

/*
An action that adds a particular value to the context
*/
export const AddToContext: ActionTypeGenerator = (value: any) => {
  return async (ctx: Context): Promise<Context> => {
    await delay(100);
    return {
      ...ctx,
      added: value,
    };
  };
};

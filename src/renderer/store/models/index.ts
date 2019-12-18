import { twitch } from "./twitch";

// function to create a one second delay
const delay = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));

// count model
const count = {
  state: 0,
  reducers: {
    addBy(state: number, payload: number) {
      return state + payload
    }
  },
  effects: (dispatch: any) => ({
    async addByAsync(payload: number, state: number) {
      await delay(1000)
      dispatch.count.addBy(1)
    }
  })
};

export { twitch, count };

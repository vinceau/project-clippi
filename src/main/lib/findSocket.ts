import ipc from "node-ipc";

const isSocketTaken = async (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on("error", () => {
        ipc.disconnect(name);
        resolve(false);
      });

      ipc.of[name].on("connect", () => {
        ipc.disconnect(name);
        resolve(true);
      });
    });
  });
};

export const findOpenSocket = async (): Promise<string> => {
  let currentSocket = 1;
  console.log("checking", currentSocket);
  while (await isSocketTaken("myapp" + currentSocket)) {
    currentSocket++;
    console.log("checking", currentSocket);
  }
  console.log("found socket", currentSocket);
  return "myapp" + currentSocket;
};

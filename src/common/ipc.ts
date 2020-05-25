/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcMain, IpcRenderer, WebContents } from "electron";

import { Message, RequestType, ResponseType } from "common/types";

export type IPCResponse<T> = [T, Error];
declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

export const routeResponse = <X extends Message>(msg: X): string => `${msg}-response`;

export class IPC {
  private readonly self: IpcRenderer | IpcMain;
  private readonly other: () => IpcRenderer | WebContents;

  constructor(self: IpcRenderer | IpcMain, other: () => IpcRenderer | WebContents) {
    this.self = self;
    this.other = other;
  }

  public sendMessage = <T extends Message>(route: T, value?: RequestType<T>): void => {
    // log(`sendMessage ${route} ${JSON.stringify(value)} ${error}`);
    this.other().send(route, value, null);
  };

  public replyToMessage = <T extends Message>(
    route: string,
    value?: ResponseType<T> | null,
    error?: Error | null
  ): void => {
    // log(`sendMessage ${route} ${JSON.stringify(value)} ${error}`);
    this.other().send(route, value, error);
  };

  // In order to use this, two routes must be defined in index.js, `${route}` and
  // `${route}-response`.
  public sendSyncWithTimeout = async <T extends Message>(
    route: T,
    seconds: number,
    value?: RequestType<T>
  ): Promise<ResponseType<T> | null> =>
    new Promise<ResponseType<T>>((resolve, reject) => {
      // log(`sendSyncWithTimeout ${route}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.once as any)(routeResponse(route), (response: ResponseType<T> | null, error?: Error) => {
        // log(`sendSyncWith ${route} => (${error ? `err: ${error}` : value})`);

        if (error) {
          reject(error);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resolve(response!);
      });

      this.sendMessage(route, value);

      // Reject after 1 minute
      if (seconds) {
        setTimeout(() => {
          reject(new Error("timeout"));
        }, seconds * 1000);
      }
    });

  public on = <T extends Message>(
    route: T,
    callback: (params: RequestType<T>, error: Error) => ResponseType<T> | Promise<ResponseType<T>>,
    options?: { dontReply?: boolean }
  ): void => {
    this.self.on(route, async (_event: any, ...args: IPCResponse<RequestType<T>>) => {
      // log(`handling on(${route}) with args: (${JSON.stringify(args)})`);
      let response: ResponseType<T> | null = null;
      try {
        const [params, error] = args;
        response = await callback(params, error);
      } catch (error) {
        console.error(error);
        this.replyToMessage<T>(routeResponse(route), response, error);
        return;
      }

      if (!options || !options.dontReply) {
        this.replyToMessage<T>(routeResponse(route), response);
      }
    });
  };

  public delayedOn = <T extends Message>(
    route: T,
    callback: (params: RequestType<T>, error: Error) => void | Promise<void>
  ): void => {
    this.on<T>(route, callback as any, { dontReply: true });
  };

  public once = <T extends Message>(
    route: T,
    callback: (params: RequestType<T> | null, error?: Error) => void | Promise<void>
  ): void => {
    this.self.once(route, async (_event: any, ...args: IPCResponse<RequestType<T>>) => {
      try {
        const [params, error] = args;
        callback(params, error);
      } catch (error) {
        callback(null, error);
      }
    });
  };
}

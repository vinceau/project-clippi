declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";

declare module "*.md";

declare module "node-notifier";
declare module "insert-text-at-cursor";

declare module "formatter" {
    export type Formatter = (ctx: Record<string, any>) => string;

    const defaultFormatterExport: (str: string) => Formatter;

    export default defaultFormatterExport;
}

declare const __VERSION__: string;
declare const __DATE__: string;
declare const __BUILD__: string;

// typings/custom.d.ts
declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
      constructor();
    }
  
    export default WebpackWorker;
  }
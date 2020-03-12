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

type Styles = Record<string, string>;

declare module "*.svg" {
  import React = require("react");

  export const ReactComponent: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement | null;

  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: Styles;
  export default content;
}

declare module "*.sass" {
  const content: Styles;
  export default content;
}

declare module "*.css" {
  const content: Styles;
  export default content;
}

declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";

declare module "*.md";
declare module "*.module.css";

declare module "filename-reserved-regex";
declare module "insert-text-at-cursor";
declare module "react-beautiful-dnd";

declare module "raw-loader!*.md" {
  const content: string;
  export default content;
}

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

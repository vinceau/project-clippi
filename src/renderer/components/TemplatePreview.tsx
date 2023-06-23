/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import type { GameStartType } from "@slippi/slippi-js";
import { parseFileRenameFormat } from "common/context";
import * as React from "react";

export const TemplatePreview: React.FC<{
  template: string;
  settings?: GameStartType;
  metadata?: any;
}> = (props) => {
  const parsedTemplate = parseFileRenameFormat(props.template, props.settings, props.metadata);
  return (
    <span
      css={css`
        word-break: break-all;
      `}
    >
      {parsedTemplate}
    </span>
  );
};

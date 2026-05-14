/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import type { GameStartType } from "@slippi/slippi-js";
import { parseFileRenameFormat } from "common/context";
import * as React from "react";

export const TemplatePreview = ({ template, settings, metadata }: { template: string; settings?: GameStartType; metadata?: any }) => {
  const parsedTemplate = parseFileRenameFormat(template, settings, metadata);
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

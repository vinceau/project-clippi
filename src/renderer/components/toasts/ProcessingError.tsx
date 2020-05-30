/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { A } from "../ExternalLink";

export const ProcessingError: React.FC<{
  errorMessage: string;
}> = (props) => {
  const { errorMessage } = props;
  const url = `https://twitter.com/ProjectClippi`;
  return (
    <div>
      <h3>An error occurred during processing</h3>
      <p>
        Please tweet this error to <A href={url}>@ProjectClippi</A> for assistance.
      </p>
      <pre
        css={css`
          white-space: initial;
          word-break: break-all;
        `}
      >
        {errorMessage}
      </pre>
    </div>
  );
};

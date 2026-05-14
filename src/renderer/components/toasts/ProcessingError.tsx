import React from "react";

import { ExternalLink as A } from "../ExternalLink";

import styles from "./ProcessingError.module.css";

export function ProcessingError({ errorMessage }: { errorMessage: string }) {
  const url = `https://twitter.com/ProjectClippi`;
  return (
    <div>
      <h3>An error occurred during processing</h3>
      <p>
        Please tweet this error to <A href={url}>@ProjectClippi</A> for assistance.
      </p>
      <pre className={styles.errorBlock}>
        {errorMessage}
      </pre>
    </div>
  );
}

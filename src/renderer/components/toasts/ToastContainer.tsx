import React from "react";
import { Slide, ToastContainer as TC } from "react-toastify";

import styles from "./ToastContainer.module.css";

function CloseButton({ closeToast }: { closeToast?: () => void }) {
  return (
    <span role="button" className={styles.closeButton} onClick={closeToast}>
      ✕
    </span>
  );
}

export function ToastContainer(): JSX.Element {
  return (
    <div className={styles.toastContainer}>
      <TC autoClose={3000} transition={Slide} hideProgressBar closeButton={<CloseButton />} />
    </div>
  );
}

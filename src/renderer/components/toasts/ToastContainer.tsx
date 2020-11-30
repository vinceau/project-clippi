import React from "react";
import { Slide, ToastContainer as TC } from "react-toastify";
import styled from "@emotion/styled";

import alertIcon from "@/styles/images/icons/alert.svg";
import infoIcon from "@/styles/images/icons/info.svg";
import successIcon from "@/styles/images/icons/success.svg";

const CloseButton: React.FC<{
  closeToast?: () => void;
}> = ({ closeToast }) => (
  <span role="button" onClick={closeToast}>
    ✕
  </span>
);

interface ToastTheme {
  primary: string;
  secondary: string;
}

const warnTheme: ToastTheme = {
  primary: "rgb(191, 38, 0)",
  secondary: "rgb(255, 235, 230)",
};

const infoTheme: ToastTheme = {
  primary: "rgb(38, 132, 255)",
  secondary: "#daecff",
};

const successTheme: ToastTheme = {
  primary: "rgb(0, 102, 68)",
  secondary: "#e3fcef",
};

const StyledToastContainer = styled(TC)`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 50px;
    border-radius: 4px;
    padding-left: 30px;
    &::before {
      content: "";
      color: rgba(255, 255, 255, 0.8);
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 100%;
    }
    &::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 0;
      width: 20px;
      height: 100%;
      mask-repeat: no-repeat;
      mask-size: contain;
      mask-position-y: 5px;
    }
    .Toastify__close-button {
      color: currentColor;
      opacity: 0.5;
    }
  }
  .Toastify__toast--error {
    color: ${warnTheme.primary};
    background: ${warnTheme.secondary};
    &::before {
      background-color: ${warnTheme.primary};
    }
    &::after {
      background-color: ${warnTheme.secondary};
      mask-image: url("${alertIcon}");
    }
  }
  .Toastify__toast--info {
    color: ${infoTheme.primary};
    background: ${infoTheme.secondary};
    &::before {
      background-color: ${infoTheme.primary};
    }
    &::after {
      background-color: ${infoTheme.secondary};
      mask-image: url("${infoIcon}");
    }
  }
  .Toastify__toast--success {
    color: ${successTheme.primary};
    background: ${successTheme.secondary};
    &::before {
      background-color: ${successTheme.primary};
    }
    &::after {
      background-color: ${successTheme.secondary};
      mask-image: url("${successIcon}");
    }
  }
  .Toastify__toast-body {
    max-width: 100%;
    margin-left: 10px;
    font-size: 13px;
    font-weight: normal;
    h3 {
      font-size: 15px;
    }
  }
  .Toastify__progress-bar {
  }
  a {
    text-decoration: underline;
  }
`;

export const ToastContainer = (): JSX.Element => (
  <StyledToastContainer autoClose={3000} transition={Slide} hideProgressBar={true} closeButton={<CloseButton />} />
);

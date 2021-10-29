/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { Slide, ToastContainer as TC } from "react-toastify";

import alertIcon from "@/styles/images/icons/alert.svg";
import infoIcon from "@/styles/images/icons/info.svg";
import successIcon from "@/styles/images/icons/success.svg";

const CloseButton: React.FC<{
  closeToast?: () => void;
}> = ({ closeToast }) => (
  <span role="button" className="close-button" onClick={closeToast}>
    ✕
  </span>
);

interface ToastTheme {
  primary: string;
  secondary: string;
  icon: any;
}

const toastThemes: { [theme: string]: ToastTheme } = {
  error: {
    primary: "rgb(191, 38, 0)",
    secondary: "rgb(255, 235, 230)",
    icon: alertIcon,
  },
  info: {
    primary: "rgb(38, 132, 255)",
    secondary: "#daecff",
    icon: infoIcon,
  },
  success: {
    primary: "rgb(0, 102, 68)",
    secondary: "#e3fcef",
    icon: successIcon,
  },
};

const getToastStyles = (themeName: string) => {
  const { primary, secondary, icon } = toastThemes[themeName];
  return css`
    color: ${primary};
    background: ${secondary};
    &::before {
      background-color: ${primary};
    }
    &::after {
      background-color: ${secondary};
      mask-image: url("${icon}");
    }
    .buttons a,
    .buttons button {
      background: ${primary};
      color: ${secondary};
    }
    `;
};

const StyledToastContainer = styled(TC)`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    cursor: initial;
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
    ${getToastStyles("error")}
  }
  .Toastify__toast--info {
    ${getToastStyles("info")}
  }
  .Toastify__toast--success {
    ${getToastStyles("success")}
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
  .buttons {
    text-align: right;
    a,
    button {
      display: inline-block;
      text-decoration: none;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      &:hover {
        opacity: 0.8;
      }
      transition: opacity 0.2s ease-in-out;
    }
  }
  .close-button {
    cursor: pointer;
  }
`;

export const ToastContainer = (): JSX.Element => (
  <StyledToastContainer autoClose={3000} transition={Slide} hideProgressBar={true} closeButton={<CloseButton />} />
);

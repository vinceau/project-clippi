import React from "react";
import { Slide, ToastContainer as TC } from "react-toastify";
import styled from "@emotion/styled";

const CloseButton: React.FC<{
  closeToast?: () => void;
}> = ({ closeToast }) => (
  <span role="button" onClick={closeToast}>
    ✕
  </span>
);

const StyledToastContainer = styled(TC)`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 50px;
    border-radius: 4px;
    padding-left: 30px;
    &::before {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      padding-top: 5px;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 100%;
    }
    .Toastify__close-button {
      color: currentColor;
      opacity: 0.5;
    }
  }
  .Toastify__toast--error {
    color: rgb(191, 38, 0);
    background: rgb(255, 235, 230);
    &::before {
      content: "⚠";
      background-color: rgb(191, 38, 0);
    }
  }
  .Toastify__toast--info {
    color: rgb(38, 132, 255);
    background: #daecff;
    &::before {
      content: "ⓘ";
      background-color: rgb(38, 132, 255);
    }
  }
  .Toastify__toast--success {
    color: rgb(0, 102, 68);
    background: #e3fcef;
    &::before {
      content: "✓";
      background-color: rgb(54, 179, 126);
    }
  }
  .Toastify__toast-body {
    margin-left: 10px;
    font-size: 13px;
    font-weight: normal;
    h3 {
      font-size: 15px;
    }
  }
  .Toastify__progress-bar {
  }
`;

export const ToastContainer = (): JSX.Element => (
  <StyledToastContainer autoClose={3000} transition={Slide} hideProgressBar={true} closeButton={<CloseButton />} />
);

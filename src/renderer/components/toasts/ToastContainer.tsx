import React from "react";
import styled from "styled-components";
import { Slide, ToastContainer as TC } from "react-toastify";

const CloseButton: React.FC<{
    closeToast?: () => void;
}> = ({ closeToast }) => (<span role="button" onClick={closeToast}>✕</span>);

const StyledToastContainer = styled(TC).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 50px;
    border-radius: 4px;
    padding-left: 30px;
    &::before {
        font-size: 16px;
        color: rgba(255,255,255,0.8);
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
        content: '⚠';
        background-color: rgb(191, 38, 0);
    }
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    background: #E3FCEF;
    color: rgb(0, 102, 68);
    &::before {
        content: '✓';
        background-color: rgb(54, 179, 126);
    }
  }
  .Toastify__toast-body {
    margin-left: 10px;
  }
  .Toastify__progress-bar {
  }
`;

export const ToastContainer = () => (
    <StyledToastContainer autoClose={3000} transition={Slide} hideProgressBar={true} closeButton={<CloseButton />} />
);

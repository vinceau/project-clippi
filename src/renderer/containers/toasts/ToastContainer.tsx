import React from "react";
import styled from "styled-components";
import { ToastContainer as TC } from "react-toastify";

export const CloseButton: React.FC<{
    closeToast?: () => void;
}> = ({ closeToast }) => (
<div role="button" onClick={closeToast}>
    <svg
        height="16"
        width="14"
        viewBox="0 0 14 16"
        style={{
            display: "inline-block",
            verticalAlign: "text-top",
            fill: "currentcolor",
        }}>
            <path fillRule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z" />
        </svg>
    </div>
  );

export const StyledToastContainer = styled(TC).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 50px;
    border-radius: 4px;
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    background: #E3FCEF;
    color: rgb(0, 102, 68);
    .Toastify__close-button {
      color: rgb(0, 102, 68);
      opacity: 0.5;
    }
    &::before {
        content: '✓';
        color: white;
        display: flex;
        padding: 5px;
        justify-content: center;
        position: absolute;
        left: 0;
        top: 0;
        width: 25px;
        height: 100%;
        background-color: rgb(54, 179, 126);
    }
  }
  .Toastify__toast-body {
      margin-left: 25px;
  }
  .Toastify__progress-bar {
  }
`;

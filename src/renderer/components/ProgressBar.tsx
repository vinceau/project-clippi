import styled from "@emotion/styled";

export const ProgressBar = styled.div<{
  percent: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(p) => p.percent}%;
  background-color: ${({ theme }) => theme.secondary};
  opacity: 0.2;
  transition: all 0.5s ease-in-out;
`;

import styled from "@emotion/styled";
import { Input } from "@vinceau/slp-realtime";
import React from "react";
import {
  AButton,
  BButton,
  DpadDown,
  DpadLeft,
  DpadRight,
  DpadUp,
  LTrigger,
  RTrigger,
  StartButton,
  XButton,
  YButton,
  ZButton,
} from "react-gamecube";

const ButtonContainer = styled.div<{
  show?: boolean;
}>`
  display: ${({ show }) => (show ? "block" : "none")};
  margin: 5px;
`;

const Outer = styled.div`
  font-size: 0.4em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const ButtonPreview: React.FC<{
  value: string[];
  pressed?: boolean;
}> = (props) => {
  const { value, pressed } = props;
  return (
    <Outer>
      <ButtonContainer show={value.includes(Input.Z)}>
        <ZButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.L)}>
        <LTrigger pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.R)}>
        <RTrigger pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.A)}>
        <AButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.B)}>
        <BButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.X)}>
        <XButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.Y)}>
        <YButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.START)}>
        <StartButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.D_UP)}>
        <DpadUp pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.D_DOWN)}>
        <DpadDown pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.D_LEFT)}>
        <DpadLeft pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={value.includes(Input.D_RIGHT)}>
        <DpadRight pressed={pressed} />
      </ButtonContainer>
    </Outer>
  );
};

import React from "react";

import styled from "@emotion/styled";

import { Input } from "@vinceau/slp-realtime";

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
} from "./buttons";

export const ButtonPreview: React.FC<{
  value: string[];
  pressed?: boolean;
}> = (props) => {
  const { value, pressed } = props;
  const shouldShow = (button: Input): boolean => {
    return value.includes(button);
  };
  const Outer = styled.div`
    font-size: 0.3em;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  `;
  const ButtonContainer = styled.div<{
    show: boolean;
  }>`
    display: ${(p) => (p.show ? "block" : "none")}
    margin: 5px;
    `;
  return (
    <Outer>
      <ButtonContainer show={shouldShow(Input.Z)}>
        <ZButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.L)}>
        <LTrigger pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.R)}>
        <RTrigger pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.A)}>
        <AButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.B)}>
        <BButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.X)}>
        <XButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.Y)}>
        <YButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.START)}>
        <StartButton pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.D_UP)}>
        <DpadUp pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.D_DOWN)}>
        <DpadDown pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.D_LEFT)}>
        <DpadLeft pressed={pressed} />
      </ButtonContainer>
      <ButtonContainer show={shouldShow(Input.D_RIGHT)}>
        <DpadRight pressed={pressed} />
      </ButtonContainer>
    </Outer>
  );
};

const orderedInputs = [
  Input.Z,
  Input.L,
  Input.R,
  Input.A,
  Input.B,
  Input.X,
  Input.Y,
  Input.START,
  Input.D_UP,
  Input.D_DOWN,
  Input.D_LEFT,
  Input.D_RIGHT,
];

export const ButtonTextPreview: React.FC<{
  value: string[];
  separator?: string;
}> = (props) => {
  const separator = props.separator || " + ";
  return <span>{orderedInputs.filter((i) => props.value.includes(i)).join(separator)}</span>;
};

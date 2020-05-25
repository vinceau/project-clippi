import React from "react";

import styled from "@emotion/styled";

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

import { device } from "@/styles/device";
import { Input } from "@vinceau/slp-realtime";

export const ControllerLayout: React.FC<{
  value?: string[];
  onChange?: (values: string[]) => void;
}> = (props) => {
  const value = props.value || [];
  const isPressed = (input: Input) => {
    return value.includes(input);
  };
  const onClick = (input: Input) => {
    console.log(`${input} was clicked`);
    const filtered = value.filter((i) => i !== input);
    if (!isPressed(input)) {
      // Add button to the list
      filtered.push(input);
    }
    if (props.onChange) {
      props.onChange(filtered);
    }
  };
  const Outer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    font-size: 8px;
    font-weight: 400;
    grid-template-columns: 100%;
    grid-gap: 10px;
    @media ${device.mobileM} {
      font-size: 5px;
      grid-template-columns: repeat(3, 1fr);
    }
    @media ${device.mobileL} {
      font-size: 6px;
    }
    @media ${device.tablet} {
      font-size: 10px;
    }
    @media ${device.laptop} {
      font-size: 12px;
    }
  `;
  return (
    <Outer>
      <LTrigger pressed={isPressed(Input.L)} onClick={() => onClick(Input.L)} />
      <ZButton pressed={isPressed(Input.Z)} onClick={() => onClick(Input.Z)} />
      <RTrigger pressed={isPressed(Input.R)} onClick={() => onClick(Input.R)} />
      <DPad isPressed={isPressed} onButtonClick={onClick} />
      <StartButton pressed={isPressed(Input.START)} onClick={() => onClick(Input.START)} />
      <MainButtons isPressed={isPressed} onButtonClick={onClick} />
    </Outer>
  );
};

const MainButtons: React.FC<{
  isPressed: (input: Input) => boolean;
  onButtonClick: (input: Input) => void;
}> = (props) => {
  const { isPressed, onButtonClick } = props;
  const Outer = styled.div`
    display: grid;
    grid-gap: 1.2em;
    grid-template-columns: repeat(3, 1fr);
  `;
  return (
    <Outer>
      <span style={{ gridColumn: "1 / 3", gridRow: "1 / 2", justifySelf: "end" }}>
        <YButton pressed={isPressed(Input.Y)} onClick={() => onButtonClick(Input.Y)} />
      </span>
      <span style={{ gridColumn: "2 / 3", gridRow: "2 / 4" }}>
        <AButton pressed={isPressed(Input.A)} onClick={() => onButtonClick(Input.A)} />
      </span>
      <span style={{ gridColumn: "3 / 4", gridRow: "1 / 4", alignSelf: "end" }}>
        <XButton pressed={isPressed(Input.X)} onClick={() => onButtonClick(Input.X)} />
      </span>
      <span style={{ gridColumn: "1 / 2", gridRow: "1 / 4", alignSelf: "end", justifySelf: "end" }}>
        <BButton pressed={isPressed(Input.B)} onClick={() => onButtonClick(Input.B)} />
      </span>
    </Outer>
  );
};

const DPad: React.FC<{
  isPressed: (input: Input) => boolean;
  onButtonClick: (input: Input) => void;
}> = (props) => {
  const { isPressed, onButtonClick } = props;
  const Outer = styled.div`
    display: grid;
    grid-template-columns: 6em 5em 6em;
    font-size: 0.8em;
  `;
  return (
    <Outer>
      <span style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}>
        <DpadUp pressed={isPressed(Input.D_UP)} onClick={() => onButtonClick(Input.D_UP)} />
      </span>
      <span style={{ gridColumn: "1 / 2", gridRow: "2 / 3" }}>
        <DpadLeft pressed={isPressed(Input.D_LEFT)} onClick={() => onButtonClick(Input.D_LEFT)} />
      </span>
      <span style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
        <DpadRight pressed={isPressed(Input.D_RIGHT)} onClick={() => onButtonClick(Input.D_RIGHT)} />
      </span>
      <span style={{ gridColumn: "2 / 3", gridRow: "3 / 4" }}>
        <DpadDown pressed={isPressed(Input.D_DOWN)} onClick={() => onButtonClick(Input.D_DOWN)} />
      </span>
    </Outer>
  );
};

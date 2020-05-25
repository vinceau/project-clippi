import React from "react";

import styled from "@emotion/styled";

import { Labelled } from "../Labelled";
import { ButtonPicker } from "./ButtonPicker";
import { ButtonPreview } from "./ButtonPreview";

export const ButtonInput: React.FC<{
  value?: string[];
  onChange?: (newButtons: string[]) => void;
}> = (props) => {
  const { value, onChange } = props;
  const Target = styled.div`
    padding: 10px;
    border: solid 2px ${({ theme }) => theme.foreground3};
    border-radius: 5px;
    cursor: pointer;
  `;
  const SelectButton = styled.div`
    margin: 10px 0;
    text-align: center;
  `;
  return (
    <div>
      <ButtonPicker value={value} onChange={onChange}>
        <Labelled title="Click to select a button combination" style={{ width: "100%" }}>
          <Target>
            {value && value.length > 0 ? (
              <ButtonPreview value={value} />
            ) : (
              <SelectButton>No buttons selected</SelectButton>
            )}
          </Target>
        </Labelled>
      </ButtonPicker>
    </div>
  );
};

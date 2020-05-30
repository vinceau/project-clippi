/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";

import insertTextAtCursor from "insert-text-at-cursor";
import styled from "@emotion/styled";

import { TextArea } from "semantic-ui-react";

import { ContextOptions } from "@/components/ContextOptions";
import { Field, Label } from "@/components/Form";
import { SlideReveal } from "@/components/ProcessSection";
import { TemplatePreview } from "@/components/TemplatePreview";
import { defaultRenameFormat } from "@/store/models/highlights";
import { Labelled } from "./Labelled";
import { invalidFilename } from "common/utils";

const FormatLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ResetButton = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
`;

const ErrorContainer = styled.div`
  color: red;
`;

const metadata = {
  startAt: "2001-11-21T17:33:54.000Z",
};

export const RenameFiles: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = (props) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const [renameFormat, setRenameFormat] = React.useState(props.value);
  const textRef: any = React.useRef();
  const showResetButton = renameFormat !== defaultRenameFormat;
  const resetFormat = () => {
    setRenameFormat(defaultRenameFormat);
    props.onChange(defaultRenameFormat);
  };
  const insertText = (text: string) => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    const numCharsToCheck = 2;
    const leftmostPos = Math.max(0, el.ref.current.selectionStart - numCharsToCheck);
    const rightmostPos = Math.min(el.ref.current.selectionEnd + numCharsToCheck, renameFormat.length);
    const leftChars = renameFormat.substring(leftmostPos, leftmostPos + numCharsToCheck);
    const rightChars = renameFormat.substring(rightmostPos - numCharsToCheck, rightmostPos);
    const alreadyHasBrackets = leftChars === "{{" && rightChars === "}}";
    insertTextAtCursor(textRef.current, alreadyHasBrackets ? text : `{{${text}}}`);
  };
  const isInvalid = invalidFilename(renameFormat, { allowPaths: true });
  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: "5px" }}>
        <a
          style={{ color: "#999" }}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowOptions(!showOptions);
          }}
        >
          {showOptions ? "Hide" : "Show"} format options
        </a>
      </div>
      <SlideReveal open={showOptions}>
        <ContextOptions onLabelClick={insertText} />
      </SlideReveal>
      <Field>
        <FormatLabel>
          <Label>Format</Label>
          {showResetButton && (
            <Labelled title="Restore default value">
              <ResetButton onClick={resetFormat}>Reset</ResetButton>
            </Labelled>
          )}
        </FormatLabel>
        <TextArea
          ref={textRef}
          placeholder={props.placeholder}
          value={renameFormat}
          onChange={(_, { value }) => {
            setRenameFormat(`${value || ""}`);
          }}
          onBlur={() => props.onChange(renameFormat)}
        />
        <PreviewContainer>
          {isInvalid ? (
            <ErrorContainer>Invalid filename format. Please check that there are no invalid characters.</ErrorContainer>
          ) : (
            <div>
              <b>Preview: </b>
              <TemplatePreview template={renameFormat} metadata={metadata} />
            </div>
          )}
        </PreviewContainer>
      </Field>
    </div>
  );
};

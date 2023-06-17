/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { Icon, Input, Label } from "semantic-ui-react";

const KeywordLabel = ({ name, onClick }: { name: string; onClick: () => void }) => {
  return (
    <Label style={{ fontSize: "0.8em" }}>
      {name}
      <Icon name="delete" link={true} onClick={onClick} />
    </Label>
  );
};

export const KeywordsInput = ({ value, onChange }: { value?: string[]; onChange?: (val: string[]) => void }) => {
  const currentKeywords = value ?? [];
  const [currentInput, setCurrentInput] = React.useState("");
  const submit = () => {
    // console.log("submit called");
    if (currentInput && !currentKeywords.includes(currentInput)) {
      const newValues = [...currentKeywords, currentInput];
      onChange?.(newValues);
      console.log("submit called", newValues);
    }
    setCurrentInput("");
  };

  const removeKeyword = (index: number) => {
    const newValues = [...currentKeywords];
    if (index > -1) {
      newValues.splice(index, 1);
    }
    onChange?.(newValues);
  };

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    console.log("keydown");
    if (event.which === 13) {
      // Disable sending the related form
      event.preventDefault();
      submit();
    }
  };

  return (
    <div>
      <div>
        <Input
          placeholder="Type tags here and press enter..."
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          tabIndex={0}
          type="text"
          onKeyDown={onKeyDown}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          fluid={true}
        />
      </div>
      {currentKeywords.length === 0 ? (
        <div
          css={css`
            padding-top: 1rem;
            font-size: 0.9em;
            font-style: italic;
            opacity: 0.5;
          `}
        >
          No tags specified
        </div>
      ) : (
        <div style={{ paddingTop: "1rem" }}>
          {currentKeywords.map((keyword, index) => (
            <KeywordLabel key={keyword} name={keyword} onClick={() => removeKeyword(index)} />
          ))}
        </div>
      )}
    </div>
  );
};

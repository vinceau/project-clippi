import type { GameStartType } from "@slippi/slippi-js";
import { invalidFilename } from "common/utils";
import insertTextAtCursor from "insert-text-at-cursor";
import * as React from "react";
import { TextArea } from "@/ui/TextArea/TextArea";

import { ContextOptions } from "@/components/ContextOptions";
import { Field, Label } from "@/components/Form";
import { TemplatePreview } from "@/components/TemplatePreview";
import { defaultRenameFormat } from "@/store/models/highlights";
import { Accordion } from "@/ui/Accordion/Accordion";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import styles from "./RenameFiles.module.css";

const metadata = {
  startAt: "2001-11-21T17:33:54.000Z",
  players: {
    0: {
      names: {
        netplay: "Bort",
        code: "BORT#123",
      },
    },
    2: {
      names: {
        netplay: "Yort",
        code: "YORT#456",
      },
    },
  },
};

const gameStartString = `{"slpVersion":"2.0.1","isTeams":false,"isPAL":false,"stageId":2,"players":[{"playerIndex":0,"port":1,"characterId":0,"characterColor":3,"startStocks":4,"type":0,"teamId":0,"controllerFix":"UCF","nametag":"BORT"},{"playerIndex":2,"port":3,"characterId":25,"characterColor":0,"startStocks":4,"type":1,"teamId":0,"controllerFix":"None","nametag":"YORT"}]}`;
const exampleGameStart: GameStartType = JSON.parse(gameStartString);

export function RenameFiles({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [showOptions, setShowOptions] = React.useState(false);
  const [renameFormat, setRenameFormat] = React.useState(value);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const showResetButton = renameFormat !== defaultRenameFormat;
  const resetFormat = () => {
    setRenameFormat(defaultRenameFormat);
    onChange(defaultRenameFormat);
  };
  const insertText = (text: string) => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    const numCharsToCheck = 2;
    const leftmostPos = Math.max(0, el.selectionStart - numCharsToCheck);
    const rightmostPos = Math.min(el.selectionEnd + numCharsToCheck, renameFormat.length);
    const leftChars = renameFormat.substring(leftmostPos, leftmostPos + numCharsToCheck);
    const rightChars = renameFormat.substring(rightmostPos - numCharsToCheck, rightmostPos);
    const alreadyHasBrackets = leftChars === "{{" && rightChars === "}}";
    insertTextAtCursor(textRef.current, alreadyHasBrackets ? text : `{{${text}}}`);
  };
  const isInvalid = invalidFilename(renameFormat, { allowPaths: true });
  return (
    <div>
      <div className={styles.optionsRow}>
        <Accordion.Root open={showOptions} onOpenChange={setShowOptions}>
          <Accordion.Trigger>{showOptions ? "Hide" : "Show"} format options</Accordion.Trigger>
          <Accordion.Panel>
            <ContextOptions onLabelClick={insertText} />
          </Accordion.Panel>
        </Accordion.Root>
      </div>
      <Field>
        <div className={styles.formatLabel}>
          <Label>Format</Label>
          {showResetButton && (
            <Tooltip title="Restore default value" triggerClassName={styles.resetButton} onClick={resetFormat}>
              Reset
            </Tooltip>
          )}
        </div>
        <TextArea
          ref={textRef}
          placeholder={placeholder}
          value={renameFormat}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setRenameFormat(e.target.value);
          }}
          onBlur={() => onChange(renameFormat)}
        />
        <div className={styles.previewContainer}>
          {isInvalid ? (
            <div className={styles.errorContainer}>
              Invalid filename format. Please check that there are no invalid characters.
            </div>
          ) : (
            <div>
              <b>Preview: </b>
              <TemplatePreview template={renameFormat} metadata={metadata} settings={exampleGameStart} />
            </div>
          )}
        </div>
      </Field>
    </div>
  );
}

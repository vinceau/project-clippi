import * as React from "react";

import insertTextAtCursor from "insert-text-at-cursor";
import { TextArea } from "semantic-ui-react";

import { ContextOptions } from "@/components/ContextOptions";
import { Field, Label } from "@/components/Form";
import { SlideReveal } from "@/components/ProcessSection";
import { TemplatePreview } from "@/components/TemplatePreview";
import { highlightInitialState } from "@/store/models/highlights";

export const RenameFiles: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = props => {
    const [showOptions, setShowOptions] = React.useState(false);
    const [renameFormat, setRenameFormat] = React.useState(props.value);
    const textRef: any = React.useRef();
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
    return (
        <div>
            <div style={{ textAlign: "right", marginBottom: "5px" }}>
                <a style={{ color: "#999" }} href="#" onClick={e => {
                    e.preventDefault();
                    setShowOptions(!showOptions);
                }}>{showOptions ? "Hide" : "Show"} format options</a>
            </div>
            <SlideReveal open={showOptions}>
                <ContextOptions onLabelClick={insertText} />
            </SlideReveal>
            <Field>
                <Label>Format</Label>
                <TextArea
                    ref={textRef}
                    placeholder={highlightInitialState.renameFormat}
                    value={renameFormat}
                    onChange={(_, { value }) => {
                        setRenameFormat(`${value || ""}`);
                    }}
                    onBlur={() => props.onChange(renameFormat)}
                />
            <p style={{ wordBreak: "break-all", marginTop: "10px" }}><b>Preview: </b><TemplatePreview template={renameFormat} metadata={{ startAt: "2001-11-21T17:33:54.000Z" }}/></p>
            </Field>
        </div>
    );
};

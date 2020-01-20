import * as React from "react";

import { TextArea } from "semantic-ui-react";

import { TemplatePreview, ContextOptions } from "../Misc/TemplatePreview";
import { SlideReveal } from "../Misc/ProcessSection";
import insertTextAtCursor from 'insert-text-at-cursor';

export const RenameFiles: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = props => {
    const [showOptions, setShowOptions] = React.useState(false);
    const [renameFormat, setRenameFormat] = React.useState("");
    const textRef = React.useRef();
    const insertText = (text: string) => {
        const el = textRef.current; //.ref.current;
        if (!el) {
            return;
        }
        const leftmostPos = Math.max(0, el.ref.current.selectionStart - 2);
        const rightmostPos = Math.min(el.ref.current.selectionEnd + 2, renameFormat.length);
        const leftChars = renameFormat.substring(leftmostPos, leftmostPos+2);
        const rightChars = renameFormat.substring(rightmostPos-2, rightmostPos);
        const alreadyHasBrackets = leftChars === "{{" && rightChars === "}}";
        insertTextAtCursor(textRef.current, alreadyHasBrackets ? text : `{{${text}}}`);
    };
    return (
        <div>
            <button onClick={() => {
                const el = textRef.current; //.ref.current;
                if (el !== undefined) {
                    console.log(el.ref.current.selectionStart);
                    console.log(el.ref.current.selectionEnd);
                    insertTextAtCursor(el, 'foobar');
                }
            }}>Insert text</button>
            <a href="#" onClick={e => {
                e.preventDefault();
                setShowOptions(!showOptions);
            }}>{showOptions ? "Hide" : "Show"} format options</a>
            <SlideReveal open={showOptions}>
                <ContextOptions onLabelClick={insertText} />
            </SlideReveal>
            <label>Format</label>
            <div style={{ paddingBottom: "5px" }}>
                <TextArea
                    ref={textRef}
                    value={renameFormat}
                    onChange={(e, data) => {
                        setRenameFormat(data.value);
                        // console.log(data);
                        // console.log(e);
                        // console.log(e.nativeEvent.target.selectionStart)
                        // console.log(`${value || ""}`);
                    }}
                />
            </div>
            <p><b>Preview: </b><TemplatePreview template={renameFormat} /></p>
        </div>
    );
};

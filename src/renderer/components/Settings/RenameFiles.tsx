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
    const [renameFormat, setRenameFormat] = React.useState(props.value);
    const textRef = React.useRef();
    const insertText = (text: string) => {
        if (!textRef.current) {
            return;
        }
        insertTextAtCursor(textRef.current, `{{${text}}}`);
    };
    return (
        <div>
            <button onClick={() => {
                if (textRef.current !== undefined) {
                    const el = textRef.current; //.ref.current;
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
                    // value={renameFormat}
                    onChange={(e, data) => {
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

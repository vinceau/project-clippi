import * as React from "react";

import insertTextAtCursor from "insert-text-at-cursor";
import { TextArea } from "semantic-ui-react";
import styled from "styled-components";
import { Context } from "@vinceau/event-actions";

import { fileSystemInitialState } from "@/store/models/filesystem";
import { SlideReveal } from "../Misc/ProcessSection";
import { ContextOptions, TemplatePreview } from "../Misc/TemplatePreview";

const Section = styled.div`
padding-bottom: 5px;
`;

export const FormatTextArea: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showPreview?: boolean;
    context?: Context;
    previewMetadata?: any;
}> = props => {
    const {children, placeholder, showPreview, previewMetadata, onChange, context} = props;
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
 <div style={{marginBottom: "5px"}}>
            <div style={{ textAlign: "right" }}>
                <a style={{ color: "#999" }} href="#" onClick={e => {
                    e.preventDefault();
                    setShowOptions(!showOptions);
                }}>{showOptions ? "Hide" : "Show"} format options</a>
            </div>
            <SlideReveal open={showOptions}>
                <ContextOptions context={context} onLabelClick={insertText} />
            </SlideReveal>
</div>
            {children && <Section>
                {children}
            </Section>}
            <Section>
                <TextArea
                    ref={textRef}
                    placeholder={placeholder}
                    value={renameFormat}
                    onChange={(_, { value }) => {
                        setRenameFormat(`${value || ""}`);
                    }}
                    onBlur={() => onChange(renameFormat)}
                />
            </Section>
            {showPreview && <p style={{ wordBreak: "break-all" }}><b>Preview: </b><TemplatePreview template={renameFormat} metadata={previewMetadata} /></p>}
        </div>
    );
};

export const RenameFiles: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = props => {
    return (
        <FormatTextArea
            onChange={props.onChange}
            value={props.value}
            placeholder={fileSystemInitialState.renameFormat}
            showPreview={true}
            previewMetadata={{ startAt: "2001-11-21T17:33:54.000Z" }}
        >
            <b>Format</b>
        </FormatTextArea>
    );
};

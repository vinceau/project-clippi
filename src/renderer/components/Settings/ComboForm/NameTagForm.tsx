import * as React from "react";

import { FieldArray } from "react-final-form-arrays";
import styled from "styled-components";

export const NameTagForm: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const [tag, setTag] = React.useState("");
    const { name, push, values } = props;
    const currentTags: string[] = values[name] || [];
    const submit = () => {
        if (tag && !currentTags.includes(tag)) {
            push(name, tag);
            setTag("");
        }
    };
    const onKeyDown = (event: any) => {
        if (event.which === 13) {
            // Disable sending the related form
            event.preventDefault();
            submit();
        }
    };
    const NameTag = styled.span`
    background-color: rgb(230, 230, 230);
    border-radius: 2px;
    display: flex;
    margin: 2px;
    min-width: 0px;
    box-sizing: border-box;
    label {
        border-radius: 2px;
        color: rgb(51, 51, 51);
        font-size: 85%;
        overflow: hidden;
        padding: 3px 3px 3px 6px;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
    }
    span {
        box-align: center;
        align-items: center;
        border-radius: 2px;
        display: flex;
        padding-left: 4px;
        padding-right: 4px;
        box-sizing: border-box;
    }
    `;
    return (
        <div className="string--array--form">
            <div className="form--container">
                <div className="tags-list">
                    <FieldArray name={name}>
                        {({ fields }) =>
                            fields.map((n, index) => (
                                <NameTag key={`fields--${n}--${index}--${fields[index]}`}>
                                    <label>{fields.value[index]}</label>
                                    <span
                                        onClick={() => fields.remove(index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        x
                                    </span>
                                </NameTag>
                            ))
                        }
                    </FieldArray>
                </div>
                <div className="tags--input">
                    <input autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck="false" tabIndex={0} type="text" aria-autocomplete="list" onKeyDown={onKeyDown} value={tag} onChange={e => setTag(e.target.value)} />
                </div>
            </div>
        </div>
    );
};
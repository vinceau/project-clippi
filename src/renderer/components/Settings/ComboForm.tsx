/* eslint-disable jsx-a11y/accessible-emoji */
import * as React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { ComboFilterSettings, getCharacterInfo, Character } from "slp-realtime";

import { CharacterSelect } from "./ComboForm/CharacterSelect";
import Styles from "./Styles";
// import { delay } from "@/lib/utils";
import styled from "styled-components";

import "./ComboForm/NameTagForm.scss";
import { PercentageSlider } from "./ComboForm/PercentageSlider";

// const onSubmit = async (values: Values) => {
//     await delay(300);
//     // @ts-ignore
//     window.alert(JSON.stringify(values, 0, 2));
// };

/*
export interface ComboFilterSettings {
  chainGrabbers: Character[];
  characterFilter: {
    characters: [],
    negate: false,
  },
  nameTags: string[];
  minComboPercent: number;
  comboMustKill: boolean;
  excludeCPUs: boolean;
  excludeChainGrabs: boolean;
  excludeWobbles: boolean;
  largeHitThreshold: number; // The proportion of damage that a hit has to do to be considered a large hit
  wobbleThreshold: number; // The number of pummels before it's considered a wobble
  chainGrabThreshold: number; // proportion of up throw / pummels to other moves to be considered a chain grab
  perCharacterMinComboPercent: { [characterId: number]: number };
}

*/

const CharForm: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const [tag, setTag] = React.useState("");
    const { name, push, values } = props;
    const currentTags: string[] = values[name] || [];
    const submit = () => {
        if (tag && !currentTags.includes(tag)) {
            push(name, tag);
            setTag("");
        }
    }
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

type Values = Partial<ComboFilterSettings>;


export const ComboForm: React.FC<{
    initialValues: Values;
    onSubmit: (values: Values) => void;
}> = props => {
    return (
        <Styles>
            <Form
                onSubmit={props.onSubmit}
                mutators={{
                    ...arrayMutators
                }}
                initialValues={props.initialValues}
                render={({
                    handleSubmit,
                    form: {
                        mutators: { push, pop }
                    },
                    submitting,
                    pristine,
                    values,
                    form
                }) => (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Large Hit Threshold</label>
                                <div>
                                    <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                                </div>
                            </div>
                            <div>
                                <label>Combo Must Kill</label>
                                <Field name="comboMustKill" component="input" type="checkbox" />
                            </div>
                            <div>
                                <label>Exclude CPUs</label>
                                <Field name="excludeCPUs" component="input" type="checkbox" />
                            </div>
                            <div>
                                <label>Exclude Chain-grabs</label>
                                <Field name="excludeChainGrabs" component="input" type="checkbox" />
                            </div>
                            <div>
                                <label>Exclude Wobbles</label>
                                <Field name="excludeWobbles" component="input" type="checkbox" />
                            </div>
                            <div>
                                <label>Chain Grabbers</label>
                                <CharacterSelect name="chainGrabbers" />
                            </div>
                            <div>
                                <label>Character Filter</label>
                                <CharacterSelect name="characterFilter" />
                            </div>
                            <div>
                                <label>Name Tag Filter</label>
                                <CharForm name="nameTags" pop={pop} push={push} values={values} />
                            </div>
                            <div className="buttons">
                                <button type="submit" disabled={submitting || pristine}>
                                    Save
                            </button>
                            <button
                                    type="button"
                                    onClick={form.reset}
                                    disabled={submitting || pristine}
                                >
                                    Discard Changes
                            </button>
                            </div>
                            <pre>{(JSON as any).stringify(values, 0, 2)}</pre>
                        </form>
                    )}
            />
        </Styles>
    );
};

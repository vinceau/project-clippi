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
import { produce } from "immer";
import { CustomSelect } from "./ComboForm/CustomSelect";

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

interface CharOption {
    value: Character;
    label: string;
}

const mapCharactersToOptions = (charId: Character): CharOption => {
    const c = getCharacterInfo(charId);
    return {
        value: c.id,
        label: c.name,
    };
};

const mapCharOptionToCharacter = (c: CharOption): Character => {
    return c.value;
};

const mapFormValuesToSettings = (values: any): Values => {
        let cg: Character[] = [];
        let newCharFilter: Character[] = [];
        let lh = 0;
        const { chainGrabbers, charFilter, largeHitThreshold, ...rest} = values;
        if (chainGrabbers) {
            cg = chainGrabbers.map(mapCharOptionToCharacter);
        }
        if (charFilter) {
            newCharFilter = charFilter.map(mapCharOptionToCharacter);
        }
        if (largeHitThreshold) {
            lh = largeHitThreshold / 100;
        }
        const newValues = {
            ...rest,
            chainGrabbers: cg,
            characterFilter: {
                characters: newCharFilter,
            },
            largeHitThreshold: lh,
        };
        return newValues;
}

const mapSettingsToFormValues = (initialValues: Values): any => {
    let chainGrabbers: CharOption[] = [];
    let characterFilter: CharOption[] = [];
    let lh = 0;
    if (initialValues.chainGrabbers) {
        chainGrabbers = initialValues.chainGrabbers.map(mapCharactersToOptions);
    }
    if (initialValues.characterFilter) {
        characterFilter = initialValues.characterFilter.characters.map(mapCharactersToOptions);
    }
    if (initialValues.largeHitThreshold) {
        lh = initialValues.largeHitThreshold * 100;
    }
    const newValues = Object.assign(initialValues, {
        chainGrabbers,
        charFilter: characterFilter,
        largeHitThreshold: lh,
    });
    return newValues;
}

export const ComboForm: React.FC<{
    initialValues: Values;
    onSubmit: (values: Values) => void;
}> = props => {
    console.log(props.initialValues);
    const initialValues = mapSettingsToFormValues(props.initialValues);
    const onSubmit = (values: any) => {
        props.onSubmit(mapFormValuesToSettings(values));
    };
    return (
        <Styles>
            <Form
                onSubmit={onSubmit}
                mutators={{
                    ...arrayMutators
                }}
                initialValues={initialValues}
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
                                <label>First Name</label>
                                <Field
                                    name="firstName"
                                    component="input"
                                    type="text"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <Field
                                    name="lastName"
                                    component="input"
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>
                            <div>
                                <label>Large Hit Threshold</label>
                                <div>
                                    <PercentageSlider name="largeHitThreshold" />
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
                                <label>Favorite Color</label>
                                <Field name="favoriteColor" component="select">
                                    <option />
                                    <option value="#ff0000">❤️ Red</option>
                                    <option value="#00ff00">💚 Green</option>
                                    <option value="#0000ff">💙 Blue</option>
                                </Field>
                            </div>
                            <div>
                                <label>Some string</label>
                                <CustomSelect name="someString" />
                            </div>
                            <div>
                                <label>Chain Grabbers</label>
                                <Field name="chainGrabbers" component={CharacterSelect} />
                            </div>
                            <div>
                                <label>Character Filter</label>
                                <Field name="charFilter" component={CharacterSelect} />
                            </div>
                            <div>
                                <label>Name Tag Filter</label>
                                <CharForm name="nameTags" pop={pop} push={push} values={values} />
                            </div>
                            <div>
                                <label>Toppings</label>
                                <Field name="toppings" component="select" multiple={true}>
                                    <option value="chicken">🐓 Chicken</option>
                                    <option value="ham">🐷 Ham</option>
                                    <option value="mushrooms">🍄 Mushrooms</option>
                                    <option value="cheese">🧀 Cheese</option>
                                    <option value="tuna">🐟 Tuna</option>
                                    <option value="pineapple">🍍 Pineapple</option>
                                </Field>
                            </div>
                            <div>
                                <label>Sauces</label>
                                <div>
                                    <label>
                                        <Field
                                            name="sauces"
                                            component="input"
                                            type="checkbox"
                                            value="ketchup"
                                        />{' '}
                                        Ketchup
                                </label>
                                    <label>
                                        <Field
                                            name="sauces"
                                            component="input"
                                            type="checkbox"
                                            value="mustard"
                                        />{' '}
                                        Mustard
                                </label>
                                    <label>
                                        <Field
                                            name="sauces"
                                            component="input"
                                            type="checkbox"
                                            value="mayonnaise"
                                        />{' '}
                                        Mayonnaise
                                </label>
                                    <label>
                                        <Field
                                            name="sauces"
                                            component="input"
                                            type="checkbox"
                                            value="guacamole"
                                        />{' '}
                                        Guacamole 🥑
                                </label>
                                </div>
                            </div>
                            <div>
                                <label>Best Stooge</label>
                                <div>
                                    <label>
                                        <Field
                                            name="stooge"
                                            component="input"
                                            type="radio"
                                            value="larry"
                                        />{' '}
                                        Larry
                                </label>
                                    <label>
                                        <Field
                                            name="stooge"
                                            component="input"
                                            type="radio"
                                            value="moe"
                                        />{' '}
                                        Moe
                                </label>
                                    <label>
                                        <Field
                                            name="stooge"
                                            component="input"
                                            type="radio"
                                            value="curly"
                                        />{' '}
                                        Curly
                                </label>
                                </div>
                            </div>
                            <div>
                                <label>Notes</label>
                                <Field name="notes" component="textarea" placeholder="Notes" />
                            </div>
                            <div className="buttons">
                                <button type="submit" disabled={submitting || pristine}>
                                    Submit
                            </button>
                                <button
                                    type="button"
                                    onClick={form.reset}
                                    disabled={submitting || pristine}
                                >
                                    Reset
                            </button>
                            </div>
                            <pre>{(JSON as any).stringify(values, 0, 2)}</pre>
                        </form>
                    )}
            />
        </Styles>
    );
};

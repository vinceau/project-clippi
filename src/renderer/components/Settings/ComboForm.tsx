/* eslint-disable jsx-a11y/accessible-emoji */
import * as React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { ComboFilterSettings } from "slp-realtime";

import { CharacterSelect, characterSelectOptions, CharacterSelectAdapter } from "./ComboForm/CharacterSelect";
import Styles from "./Styles";

import "./ComboForm/NameTagForm.scss";
import { PercentageSlider } from "./ComboForm/PercentageSlider";
import { NameTagForm } from "./ComboForm/NameTagForm";


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


type Values = Partial<ComboFilterSettings>;


export const ComboForm: React.FC<{
    initialValues: Values;
    onSubmit: (values: Values) => void;
}> = props => {
    const [ selection, setSelection ] = React.useState({});
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
                                <label>Character Filter</label>
                                <CharacterSelect name="characterFilter" isMulti={true} />
                            </div>
                            <div>
                                <label>Minimum Combo Percent</label>
                                <Field name="minComboPercent" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                            </div>
                            <div>
                                <label>Name Tag Filter</label>
                                <NameTagForm name="nameTags" pop={pop} push={push} values={values} />
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
                                <CharacterSelect name="chainGrabbers" isMulti={true} />
                            </div>
                            <div>
                                <label>Single char</label>
                                <CharacterSelect name="test" />
                            </div>
                            <div>
                                <label>Large Hit Threshold</label>
                                <div>
                                    <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                                </div>
                            </div>
                            <div>
                                <label>Chaingrab Threshold</label>
                                <div>
                                    <PercentageSlider name="chainGrabThreshold" min="0" max="1" />
                                </div>
                            </div>
                            <div>
                                <label>Min. Pummels per Wobble</label>
                                <Field name="wobbleThreshold" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                            </div>
                            <div><CharacterSelectAdapter value={selection} onChange={setSelection} options={characterSelectOptions}/></div>
                            <div>Selection: <pre>{JSON.stringify(selection)}</pre></div>
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

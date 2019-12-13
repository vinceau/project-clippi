/* eslint-disable jsx-a11y/accessible-emoji */
import * as React from 'react';
import Styles from './Styles';
import { Form, Field } from 'react-final-form';

import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { ComboFilterSettings } from 'slp-realtime';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = async (values: Values) => {
    await sleep(300);
    // @ts-ignore
    window.alert(JSON.stringify(values, 0, 2));
};

/*
export interface ComboFilterSettings {
  chainGrabbers: Character[];
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

export const ComboForm = () => (
    <Styles>
        <Form
            onSubmit={onSubmit}
            mutators={{
                ...arrayMutators
            }}
            initialValues={{ comboMustKill: true }}
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
                        <label>Combo Must Kill</label>
                        <Field name="comboMustKill" component="input" type="checkbox" />
                    </div>
                    <div>
                        <label>Exclude CPUs Must Kill</label>
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
                    <div className="buttons">
                        <button type="button" onClick={() => push('customers', undefined)}>
                            Add Customer
                        </button>
                        <button type="button" onClick={() => pop('customers')}>
                            Remove Customer
                        </button>
                    </div>
                    <FieldArray name="customers">
                        {({ fields }) =>
                            fields.map((name, index) => (
                                <div key={name}>
                                    <label>Cust. #{index + 1}</label>
                                    <Field
                                        name={`${name}.firstName`}
                                        component="input"
                                        placeholder="First Name"
                                    />
                                    <Field
                                        name={`${name}.lastName`}
                                        component="input"
                                        placeholder="Last Name"
                                    />
                                    <span
                                        onClick={() => fields.remove(index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        ❌
                                    </span>
                                </div>
                            ))
                        }
                    </FieldArray>
                    <div>
                        <label>Best Stooge</label>
                        <div>
                            <label>
                                <Field name="stooge" component="input" type="radio" value="larry" />{' '}
                                Larry
                            </label>
                            <label>
                                <Field name="stooge" component="input" type="radio" value="moe" />{' '}
                                Moe
                            </label>
                            <label>
                                <Field name="stooge" component="input" type="radio" value="curly" />{' '}
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

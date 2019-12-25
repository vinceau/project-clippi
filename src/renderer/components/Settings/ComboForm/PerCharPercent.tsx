import * as React from "react";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { CharacterSelectAdapter } from "./CharacterSelect";

export const PerCharPercent: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const { name, values, push } = props;
    const selectedCharacters = (values[name] || []).filter((c: any) => Boolean(c)).map((c: any) => c.character);
    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
            <FieldArray name={name}>
                {({ fields }) => {
                    return fields.map((n, index) => {
                        return (
                        <div key={n} style={{display: "flex", flexDirection: "row"}}>
                            <CharacterSelectAdapter
                                name={`${n}.character`}
                                disabledOptions={selectedCharacters}
                            />
                            <Field name={`${n}.percent`} component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                            <span
                                onClick={() => fields.remove(index)}
                                style={{ cursor: "pointer" }}
                            >
                                ❌
                            </span>
                        </div>
                    );
                        });
                }
                }
            </FieldArray>
            <div className="buttons">
                <button type="button" onClick={() => push(name, undefined)}>
                    Add Character
                </button>
            </div>
        </div>
    );
};

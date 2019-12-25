import * as React from "react";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { CharacterSelectAdapter } from "./CharacterSelect";

/*
interface Value {
    character: any;
    percent: any;
}

export const CharacterSelect = (props: any) => {
    const { name, ...rest } = props;
    const chars = sortedCharacters.map(c => ({
      value: c.id,
      label: c.name,
    }));
    const optionToValue = (o: any): Character => o.value;
    const valueToOption = (c: Character) => ({
      value: c,
      label: getCharacterName(c),
    });
  
    return (<Field name={props.name}>
      {fprops => {
        const { input, ...frest } = fprops;
        const value = input.value && input.value.map ? input.value.map(valueToOption) : input.value;
        const onChange = (v: any) => input.onChange(v.map(optionToValue));
        const newInput = {
          ...input,
          value,
          onChange,
        };
        return (
          <ReactSelectAdapter {...rest} {...frest} input={newInput} options={chars} />
        );
      }}
    </Field>);
  };

  */

export const PerCharPercent: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const { name, values, push, pop } = props;
    const selectedCharacters = (values[name] || []).filter(c => Boolean(c)).map(c => c.character);
    const formatter = (value: any, name: string): any => {
        console.log(`inside formatter. ${name} value:`);
        console.log(value);
        return value;
    };
    const parser = (value: any, name: string): any => {
        console.log(`inside parser. ${name} value:`);
        console.log(value);
        return value;
    };
    // const valueFormat = (v: Value[]): any => {
    //     console.log('inside value format. got value:');
    //     console.log(v);
    //     const newV = {};
    //     for (const val of v) {
    //         newV[val.character] = val.percent;
    //     }
    //     return newV;
    // };
    // const valueParse = (v: any): Value[] => {
    //     console.log('inside value parse. got value:');
    //     console.log(v);
    //     const newV: Value[] = [];
    //     for (const [key, value] of Object.entries(v)) {
    //         console.log(`${key}: ${value}`);
    //         newV.push({
    //             character: key,
    //             percent: value,
    //         });
    //     }
    //     return newV;
    // };
    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
            <FieldArray name={name}>
                {({ fields }) => {
                    // console.log(fields);
                    return fields.map((name, index) => {
                        // console.log(name, index);
                        return (
                        <div key={name} style={{display: "flex", flexDirection: "row"}}>
                            <CharacterSelectAdapter
                                name={`${name}.character`}
                                disabledOptions={selectedCharacters}
                            />
                            <Field name={`${name}.percent`} component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                            <span
                                onClick={() => fields.remove(index)}
                                style={{ cursor: 'pointer' }}
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
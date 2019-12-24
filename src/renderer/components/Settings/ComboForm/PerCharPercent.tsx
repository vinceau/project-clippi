import * as React from "react";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";

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

export const PerCharPercent: React.FC<{ name: string; push: any; pop: any }> = props => {
    const { name, push, pop } = props;
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
        <>
            <div className="buttons">
                <button type="button" onClick={() => push(name, undefined)}>
                    Add Customer
                </button>
                <button type="button" onClick={() => pop(name)}>
                    Remove Customer
                </button>
            </div>
            <FieldArray name={name} format={formatter} parse={parser}>
                {({ fields }) => {
                    // console.log(fields);
                    return fields.map((name, index) => {
                        // console.log(name, index);
                        return (
                        <div key={name}>
                            <label>Cust. #{index + 1}</label>
                            <Field
                                name={`${name}.character`}
                                component="input"
                                placeholder="First Name"
                            />
                            <Field
                                name={`${name}.percent`}
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
                    );
                        });
                }
                }
            </FieldArray>
        </>
    );
};
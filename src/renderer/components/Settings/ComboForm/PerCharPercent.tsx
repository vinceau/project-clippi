import * as React from "react";

import { Icon, Button } from "semantic-ui-react";
import { Character, getCharacterName } from "@vinceau/slp-realtime";
import { produce } from "immer";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";

import { CharacterSelectAdapter } from "./CharacterSelect";
import { SemanticInput } from "./FormAdapters";

interface CharPercentOption {
    character: Character;
    percent: number;
}

export const mapCharacterPercentArrayToObject = (name: string, values: any): any => produce(values, (draft: any) => {
    const newValue = {};
    draft[name].forEach((c: CharPercentOption) => {
        newValue[c.character] = c.percent;
    });
    draft[name] = newValue;
});

export const mapObjectToCharacterPercentArray = (name: string, values: any): any => produce(values, (draft: any) => {
    const charPercents = draft[name];
    const percentArray: CharPercentOption[] = [];
    for (const [key, value] of Object.entries(charPercents)) {
        percentArray.push({
            character: parseInt(key, 10),
            percent: value as number,
        });
    }
    percentArray.sort((a, b) => {
        const aName = getCharacterName(a.character);
        const bName = getCharacterName(b.character);
        if (aName < bName) { return -1; }
        if (aName > bName) { return 1; }
        return 0;
      });
    draft[name] = percentArray;
});

export const PerCharPercent: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const { name, values, push } = props;
    const selectedChars: CharPercentOption[] = values[name] || [];
    const selectedCharIDs = selectedChars.filter(c => Boolean(c)).map(c => c.character);
    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
            <FieldArray name={name}>
                {({ fields }) => {
                    return fields.map((n, index) => {
                        return (
                        <div key={n} style={{display: "flex", flexDirection: "row"}}>
                            <CharacterSelectAdapter
                                name={`${n}.character`}
                                disabledOptions={selectedCharIDs}
                            />
                            <Field
                                name={`${n}.percent`}
                                component={SemanticInput}
                                type="number"
                                parse={(v: string) => parseInt(v, 10)}
                                // label={{ basic: true, content: "%" }}
                                // labelPosition="right"
                                action={<Button onClick={() => fields.remove(index)} content="Remove" />}
                            />
                        </div>
                    );
                        });
                }
                }
            </FieldArray>
<div>
            <Button onClick={() => push(name, undefined)}><Icon name="add user"/> Add character</Button>
</div>
        </div>
    );
};

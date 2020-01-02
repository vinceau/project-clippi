import * as React from "react";

import { Character, getCharacterName } from "@vinceau/slp-realtime";
import { produce } from "immer";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { Button, Icon } from "semantic-ui-react";

import { CharacterSelectAdapter } from "./CharacterSelect";
import { SemanticInput } from "./FormAdapters";

import styled from "styled-components";

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

const Buttons = styled.div`
padding: 10px 0;
`;

const CharacterSelectContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 5px 0;
& > div {
    padding: 0 2px;
}
`;

export const PerCharPercent: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const { name, values, push } = props;
    const selectedChars: CharPercentOption[] = values[name] || [];
    const selectedCharIDs = selectedChars.filter(c => Boolean(c)).map(c => c.character);
    return (
        <div>
            <FieldArray name={name}>
                {({ fields }) => {
                    return fields.map((n, index) => {
                        return (
                            <CharacterSelectContainer key={n}>
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
                            </CharacterSelectContainer>
                        );
                    });
                }
                }
            </FieldArray>
            <Buttons>
                <Button onClick={() => push(name, undefined)}><Icon name="add user" /> Add character</Button>
            </Buttons>
        </div>
    );
};

import * as React from "react";
import styled from "styled-components";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { Button, Icon } from "semantic-ui-react";

import { device } from "@/styles/device";
import { CharacterSelectAdapter } from "./CharacterSelect";
import { SemanticInput } from "./FormAdapters";
import { CharPercentOption } from "@/lib/profile";

const CharacterSelectContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 5px 0;
& > div {
    padding: 2px;
    flex-basis: 100%;
    width: 100%;
}
@media ${device.tablet} {
    flex-direction: row;
    & > div {
        flex-basis: 50%;
        width: 50%;
    }
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
                                    width="100%"
                                />
                                <Field
                                    name={`${n}.percent`}
                                    component={SemanticInput}
                                    type="number"
                                    parse={(v: string) => parseInt(v, 10)}
                                    action={<Button onClick={() => fields.remove(index)} content="Remove" />}
                                />
                            </CharacterSelectContainer>
                        );
                    });
                }
                }
            </FieldArray>
            <div style={{padding: "10px 0"}}>
                <Button onClick={() => push(name, undefined)}><Icon name="add user" /> Add character</Button>
            </div>
        </div>
    );
};

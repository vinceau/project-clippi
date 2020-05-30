import * as React from "react";
import styled from "@emotion/styled";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { Button, Icon } from "semantic-ui-react";

import { CharPercentOption } from "@/lib/profile";
import { CharacterSelectAdapter } from "./CharacterSelect";
import { SemanticInput } from "./FormAdapters";

const CharacterSelectContainer = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
`;

export const PerCharPercent: React.FC<{ name: string; values: any; push: any; pop: any }> = (props) => {
  const { name, values, push } = props;
  const selectedChars: CharPercentOption[] = values[name] || [];
  const selectedCharIDs = selectedChars.filter((c) => Boolean(c)).map((c) => c.character);
  return (
    <div>
      <FieldArray name={name}>
        {({ fields }) => {
          return fields.map((n, index) => {
            return (
              <CharacterSelectContainer key={n}>
                <CharacterSelectAdapter name={`${n}.character`} disabledOptions={selectedCharIDs} width="100%" />
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
        }}
      </FieldArray>
      <div style={{ padding: "10px 0" }}>
        <Button onClick={() => push(name, undefined)}>
          <Icon name="add user" /> Add character
        </Button>
      </div>
    </div>
  );
};

import React from "react";

import styled from "@emotion/styled";

import arrayMutators from "final-form-arrays";
import { Field as FinalField, Form as FinalForm } from "react-final-form";
import { Accordion, Button, Form as SemanticForm, Icon } from "semantic-ui-react";

import { CodeBlock } from "@/components/CodeBlock";
import { Field, Label, Text } from "@/components/Form";
import { ComboConfiguration } from "@/lib/profile";
import { DEFAULT_PROFILE } from "@/store/models/slippi";
import { CharacterSelectAdapter, CustomCharacterListAdapter } from "./CharacterSelect";
import { ToggleAdapter } from "./FormAdapters";
import { NameTagForm } from "./NameTagForm";
import { PercentageSlider } from "./PercentageSlider";
import { PerCharPercent } from "./PerCharPercent";
import { PortSelectAdapter } from "./PortSelection";
import { useSelector } from "react-redux";
import { iRootState } from "@/store";

type Values = Partial<ComboConfiguration>;

const OuterContainer = styled.div`
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  & > button {
    margin-bottom: 3px !important;
  }
  .delete-button:hover {
    background-color: #d01919;
    color: white;
  }
`;

const ButtonContainer: React.FC<{
  submitting: boolean;
  currentProfile?: string;
  onDelete?: () => void;
}> = ({ submitting, currentProfile, onDelete }) => {
  return (
    <OuterContainer>
      <Button primary type="submit" disabled={submitting}>
        <Icon name="save" />
        Save profile
      </Button>
      <Button className="delete-button" type="button" onClick={onDelete}>
        {currentProfile === DEFAULT_PROFILE ? (
          <>
            <Icon name="undo" />
            Reset profile
          </>
        ) : (
          <>
            <Icon name="trash" />
            Delete profile
          </>
        )}
      </Button>
    </OuterContainer>
  );
};

export const ComboForm: React.FC<{
  initialValues: Values;
  currentProfile?: string;
  onDelete: () => void;
  onSubmit: (values: Values) => void;
}> = (props) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const showDevOptions = useSelector((state: iRootState) => state.appContainer.showDevOptions);
  return (
    <div>
      <FinalForm
        onSubmit={props.onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={props.initialValues}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop },
          },
          submitting,
          values,
        }) => (
          <div>
            <SemanticForm onSubmit={handleSubmit}>
              <ButtonContainer
                submitting={submitting}
                currentProfile={props.currentProfile}
                onDelete={props.onDelete}
              />
              <Field border="top">
                <Label>Character Filter</Label>
                {showDevOptions ? (
                  <CustomCharacterListAdapter name="characterFilter" />
                ) : (
                  <CharacterSelectAdapter name="characterFilter" isMulti={true} />
                )}
                <Text>
                  Only match combos performed by these characters. Leave this empty to find combos for all characters.
                </Text>
              </Field>
              <Field>
                <Label>Name Tag Filter</Label>
                <NameTagForm name="nameTags" pop={pop} push={push} values={values} />
                <Text>
                  Only match combos performed by players using these name tags. These can be in-game tags or Slippi
                  Online nicknames and connect codes.
                </Text>
              </Field>
              <Field border="bottom">
                <Label>Port Filter</Label>
                <PortSelectAdapter name="portFilter" />
                <Text>Only match combos performed by players using these ports.</Text>
              </Field>
              <Field>
                <Label>Minimum Combo Length</Label>
                <FinalField
                  name="minComboLength"
                  component="input"
                  type="number"
                  format={(val) => parseInt(val)}
                  formatOnBlur={true}
                />
                <Text>Only match combos which contain at least this many moves.</Text>
              </Field>
              <Field>
                <Label>Minimum Combo Percent</Label>
                <FinalField
                  name="minComboPercent"
                  component="input"
                  type="number"
                  format={(val) => parseInt(val)}
                  formatOnBlur={true}
                />
                <Text>Only match combos which do at least this much percent damage.</Text>
              </Field>
              <Field>
                <Label>Character-specific Minimum Combo Percent</Label>
                <PerCharPercent name="perCharMinComboPercents" pop={pop} push={push} values={values} />
                <Text>
                  Only match combos if the character performing the combo does at least this much percent damage.
                </Text>
              </Field>
              <Field border="top">
                <FinalField name="comboMustKill" label="Combo Must Kill" component={ToggleAdapter} />
                <Text margin="none">Only match combos which take the opponent's stock.</Text>
              </Field>
              <Field>
                <FinalField name="excludeCPUs" label="Exclude CPUs" component={ToggleAdapter} />
                <Text margin="none">Don't match combos which are played against CPUs.</Text>
              </Field>
              <Field>
                <FinalField name="excludeChainGrabs" label="Exclude Chain-grabs" component={ToggleAdapter} />
                <Text margin="none">Don't match combos which consist mainly of chain-grabs.</Text>
              </Field>
              <Field border="bottom">
                <FinalField name="excludeWobbles" label="Exclude Wobbles" component={ToggleAdapter} />
                <Text margin="none">Don't match combos which consist mainly of Wobbling.</Text>
              </Field>

              <div style={{ marginTop: "10px" }}>
                <Accordion>
                  <Accordion.Title active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Icon name="dropdown" />
                    {showAdvanced ? "Hide " : "Show "} advanced options
                  </Accordion.Title>
                  <Accordion.Content active={showAdvanced}>
                    <Field>
                      <FinalField
                        name="fuzzyNameTagMatching"
                        label="Fuzzy Name Tag Matching"
                        component={ToggleAdapter}
                      />
                      <Text margin="none">
                        When this is enabled, name tags will match in a case-insensitive manner. Name tags containing
                        spaces will also match with variants where the spaces are replaced with underscores.
                      </Text>
                    </Field>
                    <Field>
                      <Label>Chain-grab Characters</Label>
                      <CharacterSelectAdapter name="chainGrabbers" isMulti={true} />
                      <Text>Only exclude chain-grabs performed by these characters.</Text>
                    </Field>
                    <Field>
                      <Label>Chain-grab Threshold</Label>
                      <div>
                        <PercentageSlider name="chainGrabThreshold" min="0" max="1" />
                      </div>
                      <Text>
                        When excluding chain-grabs, the chain-grabs must make up this much of the combo damage for it to
                        be excluded. e.g. If the threshold is 0.8 then combos which consist 20% of chain-grabs won't be
                        excluded.
                      </Text>
                    </Field>
                    <Field>
                      <Label>Large Hit Threshold</Label>
                      <div>
                        <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                      </div>
                      <Text>
                        Exclude the combo if a single hit does proportionally this much combo damage. e.g. If the
                        threshold is 0.8 then no single move in the combo can do more than 80% of the total combo damage
                        or the combo will be excluded.
                      </Text>
                    </Field>
                    <Field>
                      <Label>Minimum Pummels per Wobble</Label>
                      <FinalField
                        name="wobbleThreshold"
                        component="input"
                        type="number"
                        format={(val) => parseInt(val)}
                        formatOnBlur={true}
                      />
                      <Text>
                        When excluding Wobbles, the Ice Climbers must pummel at least this many times in a Wobble for it
                        to be excluded.
                      </Text>
                    </Field>
                  </Accordion.Content>
                </Accordion>
              </div>
              <ButtonContainer
                submitting={submitting}
                currentProfile={props.currentProfile}
                onDelete={props.onDelete}
              />
              <CodeBlock values={values} />
            </SemanticForm>
          </div>
        )}
      />
    </div>
  );
};

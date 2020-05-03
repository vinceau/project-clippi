import * as React from "react";

import styled from "styled-components";

import arrayMutators from "final-form-arrays";
import { Field as FinalField, Form as FinalForm } from "react-final-form";
import { Accordion, Button, Form as SemanticForm, Icon } from "semantic-ui-react";

import { CodeBlock } from "@/components/CodeBlock";
import { Field, Label, Text } from "@/components/Form";
import { ComboConfiguration } from "@/lib/profile";
import { CharacterSelectAdapter } from "./CharacterSelect";
import { ToggleAdapter } from "./FormAdapters";
import { NameTagForm } from "./NameTagForm";
import { PercentageSlider } from "./PercentageSlider";
import { PerCharPercent } from "./PerCharPercent";
import { PortSelectAdapter } from "./PortSelection";

type Values = Partial<ComboConfiguration>;

export const ComboForm: React.FC<{
    initialValues: Values;
    onDelete: () => void;
    onSubmit: (values: Values) => void;
}> = props => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const ButtonContainer: React.FC<{
        submitting: boolean;
        form: any;
    }> = ({ submitting }) => {
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
        return (
            <OuterContainer>
                <Button primary type="submit" disabled={submitting}>
                    <Icon name="save" />
                    Save profile
                </Button>
                <Button
                    className="delete-button"
                    type="button"
                    onClick={props.onDelete}
                >
                    <Icon name="trash" />
                    Delete profile
                </Button>
            </OuterContainer>
        );
    };
    return (
        <div>
            <FinalForm
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
                    values,
                    form
                }) => (
                        <div>
                            <SemanticForm onSubmit={handleSubmit}>
                                <ButtonContainer submitting={submitting} form={form} />
                                <Field border="top">
                                    <Label>Character Filter</Label>
                                    <CharacterSelectAdapter name="characterFilter" isMulti={true} />
                                    <Text>Only match combos performed by these characters.</Text>
                                </Field>
                                <Field>
                                    <Label>Name Tag Filter</Label>
                                    <NameTagForm name="nameTags" pop={pop} push={push} values={values} />
                                    <Text>Only match combos performed by players using these name tags.</Text>
                                </Field>
                                <Field border="bottom">
                                    <Label>Port Filter</Label>
                                    <PortSelectAdapter name="portFilter" />
                                    <Text>Only match combos performed by players using these ports.</Text>
                                </Field>
                                <Field>
                                    <Label>Minimum Combo Length</Label>
                                    <FinalField name="minComboLength" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                    <Text>Only match combos which contain at least this many moves.</Text>
                                </Field>
                                <Field>
                                    <Label>Minimum Combo Percent</Label>
                                    <FinalField name="minComboPercent" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                    <Text>Only match combos which do at least this much percent damage.</Text>
                                </Field>
                                <Field>
                                    <Label>Character-specific Minimum Combo Percent</Label>
                                    <PerCharPercent name="perCharMinComboPercents" pop={pop} push={push} values={values} />
                                    <Text>Only match combos if the character performing the combo does at least this much percent damage.</Text>
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
                                                    When excluding chain-grabs, the chain-grabs must make up this much of the combo damage for it to be excluded.
                                                    e.g. If the threshold is 0.8 then combos which consist 20% of chain-grabs won't be excluded.
                                                </Text>
                                            </Field>
                                            <Field>
                                                <Label>Large Hit Threshold</Label>
                                                <div>
                                                    <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                                                </div>
                                                <Text>
                                                    Exclude the combo if a single hit does proportionally this much combo damage. e.g. If the threshold is 0.8
                                                    then no single move in the combo can do more than 80% of the total combo damage or the combo will be excluded.
                                                </Text>
                                            </Field>
                                            <Field>
                                                <Label>Minimum Pummels per Wobble</Label>
                                                <FinalField name="wobbleThreshold" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                                <Text>
                                                    When excluding Wobbles, the Ice Climbers must pummel at least this many times in a Wobble for it to be excluded.
                                                </Text>
                                            </Field>
                                        </Accordion.Content>
                                    </Accordion>
                                </div>
                                <ButtonContainer submitting={submitting} form={form} />
                                <CodeBlock values={values} />
                            </SemanticForm>
                        </div>
                    )}
            />
        </div>
    );
};

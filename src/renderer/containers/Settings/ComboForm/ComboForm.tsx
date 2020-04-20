import * as React from "react";

import styled from "styled-components";

import arrayMutators from "final-form-arrays";
import { Field as FinalField, Form as FinalForm } from "react-final-form";
import { Form as SemanticForm, Accordion, Button, Icon } from "semantic-ui-react";

import { CharacterSelectAdapter } from "@/components/combos/CharacterSelect";
import { NameTagForm } from "@/components/combos/NameTagForm";
import { PercentageSlider } from "@/components/combos/PercentageSlider";
import { PerCharPercent } from "@/components/combos/PerCharPercent";
import { PortSelectAdapter } from "@/components/combos/PortSelection";
import { ComboConfiguration } from "@/lib/profile";
import { CodeBlock } from "../../Misc";
import { SemanticCheckboxInput, ToggleAdapter } from "./FormAdapters";
import { Field, Label, Text } from "@/components/Form";

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
    }> = ({ submitting, form }) => {
        const OuterContainer = styled.div`
        padding: 10px 0;
        & > button {
            margin-bottom: 3px !important;
        }
        `;
        return (
            <OuterContainer>
                <Button primary type="submit" disabled={submitting}>
                    <Icon name="save" />
                    Save Profile
                </Button>
                <Button
                    type="button"
                    onClick={form.reset}
                    disabled={submitting}
                >
                    <Icon name="undo" />
                    Discard Changes
                </Button>
                <Button
                    negative={true}
                    type="button"
                    onClick={props.onDelete}
                >
                    <Icon name="trash" />
                    Delete Profile
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
                                    <Label>Port Filter</Label>
                                    <PortSelectAdapter name="portFilter" />
                                    <Text>Only match combos performed by players using these ports.</Text>
                                </Field>
                                <Field border="bottom">
                                    <Label>Name Tag Filter</Label>
                                    <NameTagForm name="nameTags" pop={pop} push={push} values={values} />
                                    <Text>Only match combos performed by players using these name tags.</Text>
                                </Field>
                                <Field>
                                    <Label>Minimum Combo Length</Label>
                                    <FinalField name="minComboLength" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                    <Text>Only match combos which contain at least these many moves.</Text>
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
                                    <Text margin="none">Only match combos which take the opponents stock.</Text>
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
                                    <Text margin="none">Don't match combos which consist mainly of wobbling.</Text>
                                </Field>

                                <Accordion>
                                    <Accordion.Title active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                                        <Icon name="dropdown" />
                                        Advanced Options
                                </Accordion.Title>
                                    <Accordion.Content active={showAdvanced}>

                                        <Field>
                                            <Label>Chain Grabbers</Label>
                                            <CharacterSelectAdapter name="chainGrabbers" isMulti={true} />
                                        </Field>
                                        <Field>
                                            <Label>Large Hit Threshold</Label>
                                            <div>
                                                <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                                            </div>
                                        </Field>
                                        <Field>
                                            <Label>Chaingrab Threshold</Label>
                                            <div>
                                                <PercentageSlider name="chainGrabThreshold" min="0" max="1" />
                                            </div>
                                        </Field>
                                        <Field>
                                            <Label>Minimum Pummels per Wobble</Label>
                                            <FinalField name="wobbleThreshold" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                        </Field>
                                    </Accordion.Content>
                                </Accordion>
                            <ButtonContainer submitting={submitting} form={form} />
                                <CodeBlock values={values} />
                            </SemanticForm>
                        </div>
                    )}
            />
        </div>
    );
};

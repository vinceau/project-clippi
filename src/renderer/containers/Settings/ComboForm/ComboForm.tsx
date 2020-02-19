import * as React from "react";

import styled from "styled-components";

import arrayMutators from "final-form-arrays";
import { Field, Form } from "react-final-form";
import { Accordion, Button, Form as SemanticForm, Icon } from "semantic-ui-react";

import { ComboConfiguration } from "@/lib/profile";
import { CodeBlock } from "../../Misc/Misc";
import { CharacterSelectAdapter } from "../../../components/combos/CharacterSelect";
import { SemanticCheckboxInput } from "./FormAdapters";
import { NameTagForm } from "../../../components/combos/NameTagForm";
import { PercentageSlider } from "../../../components/combos/PercentageSlider";
import { PerCharPercent } from "../../../components/combos/PerCharPercent";
import { PortSelectAdapter } from "../../../components/combos/PortSelection";

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
            <Form
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
                                <SemanticForm.Field>
                                    <label>Character Filter</label>
                                    <CharacterSelectAdapter name="characterFilter" isMulti={true} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label>Port Filter</label>
                                    <PortSelectAdapter name="portFilter" />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label>Minimum Combo Percent</label>
                                    <Field name="minComboPercent" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label>Minimum Combo Length</label>
                                    <Field name="minComboLength" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label>Name Tag Filter</label>
                                    <NameTagForm name="nameTags" pop={pop} push={push} values={values} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <label>Character-specific Minimum Combo Percent</label>
                                    <PerCharPercent name="perCharMinComboPercents" pop={pop} push={push} values={values} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <Field name="comboMustKill" label="Combo Must Kill" component={SemanticCheckboxInput} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <Field name="excludeCPUs" label="Exclude CPUs" component={SemanticCheckboxInput} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <Field name="excludeChainGrabs" label="Exclude Chain-grabs" component={SemanticCheckboxInput} />
                                </SemanticForm.Field>
                                <SemanticForm.Field>
                                    <Field name="excludeWobbles" label="Exclude Wobbles" component={SemanticCheckboxInput} />
                                </SemanticForm.Field>

                                <Accordion>
                                    <Accordion.Title active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                                        <Icon name="dropdown" />
                                        Advanced Options
                                </Accordion.Title>
                                    <Accordion.Content active={showAdvanced}>

                                        <SemanticForm.Field>
                                            <label>Chain Grabbers</label>
                                            <CharacterSelectAdapter name="chainGrabbers" isMulti={true} />
                                        </SemanticForm.Field>
                                        <SemanticForm.Field>
                                            <label>Large Hit Threshold</label>
                                            <div>
                                                <PercentageSlider name="largeHitThreshold" min="0" max="1" />
                                            </div>
                                        </SemanticForm.Field>
                                        <SemanticForm.Field>
                                            <label>Chaingrab Threshold</label>
                                            <div>
                                                <PercentageSlider name="chainGrabThreshold" min="0" max="1" />
                                            </div>
                                        </SemanticForm.Field>
                                        <SemanticForm.Field>
                                            <label>Min. Pummels per Wobble</label>
                                            <Field name="wobbleThreshold" component="input" type="number" parse={(v: any) => parseInt(v, 10)} />
                                        </SemanticForm.Field>
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

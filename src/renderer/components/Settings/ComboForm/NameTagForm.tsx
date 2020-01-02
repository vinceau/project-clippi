import * as React from "react";

import { FieldArray } from "react-final-form-arrays";
import { Icon, Label } from "semantic-ui-react";
import styled from "styled-components";

const NameTagLabel: React.FC<{
    name: string;
    onClick: () => void;
}> = props => {
    return (
        <Label>
            {props.name}
            <Icon name="delete" onClick={props.onClick} />
        </Label>
    );
};

const TagsList = styled.div`
    padding-top: 10px;
`;

export const NameTagForm: React.FC<{ name: string; values: any; push: any; pop: any }> = props => {
    const [tag, setTag] = React.useState("");
    const { name, push, values } = props;
    const currentTags: string[] = values[name] || [];
    const submit = () => {
        if (tag && !currentTags.includes(tag)) {
            push(name, tag);
            setTag("");
        }
    };
    const onKeyDown = (event: any) => {
        if (event.which === 13) {
            // Disable sending the related form
            event.preventDefault();
            submit();
        }
    };
    return (
        <div>
            <div>
                <input placeholder="Type your tags here..." autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck="false" tabIndex={0} type="text" aria-autocomplete="list" onKeyDown={onKeyDown} value={tag} onChange={e => setTag(e.target.value)} />
            </div>
            <TagsList>
                <FieldArray name={name}>
                    {({ fields }) =>
                        fields.map((n, index) => (
                            <NameTagLabel
                                key={`fields--${n}--${index}--${fields[index]}`}
                                name={fields.value[index]}
                                onClick={() => fields.remove(index)}
                            />
                        ))
                    }
                </FieldArray>
            </TagsList>
        </div>
    );
};

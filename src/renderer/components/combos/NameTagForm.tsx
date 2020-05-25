import * as React from "react";

import { FieldArray } from "react-final-form-arrays";
import { Icon, Label } from "semantic-ui-react";

const NameTagLabel: React.FC<{
  name: string;
  onClick: () => void;
}> = (props) => {
  return (
    <Label style={{ fontSize: "0.8em" }}>
      {props.name}
      <Icon name="delete" link onClick={props.onClick} />
    </Label>
  );
};

export const NameTagForm: React.FC<{ name: string; values: any; push: any; pop: any }> = (props) => {
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
        <input
          placeholder="Type tags here and press enter..."
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          tabIndex={0}
          type="text"
          aria-autocomplete="list"
          onKeyDown={onKeyDown}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>
      <FieldArray name={name}>
        {({ fields }) => {
          if (fields.length === 0) {
            return null;
          }
          return (
            <div style={{ paddingTop: "10px" }}>
              {fields.map((n, index) => (
                <NameTagLabel
                  key={`fields--${n}--${index}--${fields[index]}`}
                  name={fields.value[index]}
                  onClick={() => fields.remove(index)}
                />
              ))}
            </div>
          );
        }}
      </FieldArray>
    </div>
  );
};

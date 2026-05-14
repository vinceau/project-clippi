import React from "react";
import { FieldArray } from "react-final-form-arrays";
import { Icon } from "@/ui/Icon/Icon";
import { Label } from "@/ui/Label/Label";

import styles from "./NameTagForm.module.css";

function NameTagLabel({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <Label style={{ fontSize: "0.8em" }}>
      {name}
      <Icon name="delete" link onClick={onClick} />
    </Label>
  );
}

export function NameTagForm({ name, values, push }: { name: string; values: any; push: any; pop: any }) {
  const [tag, setTag] = React.useState("");
  const currentTags: string[] = values[name] || [];
  const submit = () => {
    if (tag && !currentTags.includes(tag)) {
      push(name, tag);
      setTag("");
    }
  };
  const onKeyDown = (event: any) => {
    if (event.which === 13) {
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
            return (
              <div className={styles.placeholder}>No tags specified</div>
            );
          }
          return (
            <div style={{ paddingTop: "1rem" }}>
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
}

import * as React from "react";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { Button } from "@/ui/Button/Button";
import { Icon } from "@/ui/Icon/Icon";

import type { CharPercentOption } from "@/lib/profile";
import styles from "./PerCharPercent.module.css";

import { CharacterSelectAdapter } from "./CharacterSelect";
import { SemanticInput } from "./FormAdapters";

export function PerCharPercent({ name, values, push }: { name: string; values: any; push: any; pop: any }) {
  const selectedChars: CharPercentOption[] = values[name] || [];
  const selectedCharIDs = selectedChars.filter((c) => Boolean(c)).map((c) => c.character);
  return (
    <div>
      <FieldArray name={name}>
        {({ fields }) => {
          return fields.map((n, index) => {
            return (
              <div className={styles.characterSelectContainer} key={n}>
                <CharacterSelectAdapter name={`${n}.character`} disabledOptions={selectedCharIDs} width="100%" />
                <Field
                  name={`${n}.percent`}
                  component={SemanticInput}
                  type="number"
                  parse={(v: string) => parseInt(v, 10)}
                  action={<Button type="button" onClick={() => fields.remove(index)} content="Remove" />}
                />
              </div>
            );
          });
        }}
      </FieldArray>
      <div className={styles.buttonRow}>
        <Button type="button" onClick={() => push(name, undefined)}>
          <Icon name="add user" /> Add character
        </Button>
      </div>
    </div>
  );
}

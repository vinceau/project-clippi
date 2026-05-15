import * as React from "react";

import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { Button } from "@/ui/Button/Button";
import { UserPlus } from "lucide-react";

import type { CharPercentOption } from "@/lib/profile";
import styles from "./PerCharPercent.module.css";

import { CharacterSelectAdapter } from "./CharacterSelect";
import { InputAdaptor } from "./FormAdapters";

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
                  component={InputAdaptor}
                  type="number"
                  parse={(v: string) => parseInt(v, 10)}
                  action={
                    <Button type="button" onClick={() => fields.remove(index)}>
                      Remove
                    </Button>
                  }
                />
              </div>
            );
          });
        }}
      </FieldArray>
      <div className={styles.buttonRow}>
        <Button type="button" onClick={() => push(name, undefined)}>
          <UserPlus size={16} /> Add character
        </Button>
      </div>
    </div>
  );
}

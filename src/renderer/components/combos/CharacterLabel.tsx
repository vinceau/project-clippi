import { clsx } from "clsx";
import type { Character } from "@slippi/slippi-js";
import * as React from "react";

import styles from "./CharacterLabel.module.css";
import { CharacterIcon } from "../CharacterIcon";

export function CharacterLabel({
  characterId,
  name,
  disabled,
}: {
  characterId: Character;
  name: string;
  disabled?: boolean;
}) {
  return (
    <div className={clsx(styles.container, disabled && styles.disabled)}>
      <CharacterIcon character={characterId} grayscale={disabled} />
      <span className={styles.nameLabel}>{name}</span>
    </div>
  );
}

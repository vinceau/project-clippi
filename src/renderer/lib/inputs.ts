import type { InputEventFilter } from "@vinceau/slp-realtime";
import { Input } from "@vinceau/slp-realtime";
import { secondsToFrames } from "common/utils";

const ORDERED_INPUTS = [
  Input.Z,
  Input.L,
  Input.R,
  Input.A,
  Input.B,
  Input.X,
  Input.Y,
  Input.START,
  Input.D_UP,
  Input.D_DOWN,
  Input.D_LEFT,
  Input.D_RIGHT,
];

export interface CustomInputEventFilter {
  playerIndex: number[];
  inputButtonHold: "pressed" | "held";
  buttonCombo: string[];
  inputButtonHoldDelay?: number | string;
  inputButtonHoldUnits?: "frames" | "seconds";
}

export const mapInputEventConfig = (data: CustomInputEventFilter): InputEventFilter => {
  let duration = 1;
  if (data.inputButtonHold === "held") {
    // Okay we need to actually determine the duration
    const parsedDuration = data.inputButtonHoldDelay ? +data.inputButtonHoldDelay : 1;
    if (isNaN(parsedDuration)) {
      console.warn(
        `Failed to convert input button hold delay: ${data.inputButtonHoldDelay} to a string. Defaulting to 1.`
      );
    }
    if (data.inputButtonHoldUnits === "frames") {
      // We're already in the correct unit
      duration = parsedDuration || 1; // Default to 1 if parsing failed
    } else {
      // We need to convert seconds to frames
      duration = secondsToFrames(parsedDuration);
    }
  }
  return {
    combo: data.buttonCombo,
    playerIndex: data.playerIndex,
    duration,
  };
};

export const generateButtonComboPreview = (value: string[], separator = " + "): string => {
  return ORDERED_INPUTS.filter((i) => value.includes(i)).join(separator);
};

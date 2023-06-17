import type { InputButtonCombo, RealTimeInputEvents } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import type { Observable } from "rxjs";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

import { playerFilter } from "./operators/player";
import type { EventConfig, EventEmit, EventManagerConfig, InputEventFilter } from "./types";
import { InputEvent } from "./types";

export const readInputsConfig = (inputs: RealTimeInputEvents, config: EventManagerConfig): Observable<EventEmit> => {
  return readButtonComboEvents(config, inputs);
};

interface InputEventConfig extends EventManagerConfig {
  events: Array<
    EventConfig & {
      type: InputEvent;
      filter?: InputEventFilter;
    }
  >;
}

const readButtonComboEvents = (eventConfig: EventManagerConfig, inputs: RealTimeInputEvents): Observable<EventEmit> => {
  // Handle game start events
  const observables: Observable<EventEmit>[] = (eventConfig as InputEventConfig).events
    .filter(filterValidButtonCombo) // We must have a valid filter
    .map((event) => {
      let duration = 1;
      if (exists(event.filter.duration) && event.filter.duration > 1) {
        duration = Math.floor(event.filter.duration);
      }

      const buttons = event.filter.combo;
      let base$: Observable<InputButtonCombo> = inputs.buttonCombo(buttons, duration);

      if (event.filter) {
        if (event.filter.playerNames) {
          // Replace the base observable with one that only looks at certain players
          base$ = inputs.playerNameButtonCombo({
            namesToFind: event.filter.playerNames,
            buttons,
            duration,
            fuzzyNameMatch: event.filter.fuzzyNameMatch,
          });
        } else if (event.filter.playerIndex !== undefined) {
          // Handle num players filter
          base$ = base$.pipe(playerFilter(event.filter.playerIndex, eventConfig.variables));
        }
      }

      return base$.pipe(
        map(
          (context): EventEmit => ({
            id: event.id,
            type: event.type,
            payload: context,
          })
        )
      );
    });
  return merge(...observables);
};

function filterValidButtonCombo(
  event: EventConfig & { type: InputEvent; filter?: InputEventFilter }
): event is EventConfig & { type: InputEvent; filter: InputEventFilter } {
  return (
    event.type === InputEvent.BUTTON_COMBO &&
    exists(event.filter) &&
    event.filter.combo &&
    event.filter.combo.length > 0
  ); // We must have a valid filter
}

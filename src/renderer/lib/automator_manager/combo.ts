import type { ComboEventPayload, RealTimeComboEvents } from "@vinceau/slp-realtime";
import { checkCombo, defaultComboFilterSettings } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import type { Observable } from "rxjs";
import { merge } from "rxjs";
import { filter, map } from "rxjs/operators";

import { playerFilterMatches } from "./operators/player";
import type { ComboEventFilter, EventConfig, EventEmit, EventManagerConfig, EventManagerVariables } from "./types";
import { ComboEvent } from "./types";

export const readComboConfig = (combo: RealTimeComboEvents, config: EventManagerConfig): Observable<EventEmit> => {
  const startObservables = config.events
    .filter((event) => event.type === ComboEvent.START)
    .map((event) => {
      return handlePlayerIndexFilter(combo.start$, event, config.variables).pipe(
        map(
          (payload): EventEmit => ({
            id: event.id,
            type: event.type,
            payload,
          })
        )
      );
    });
  const extendObservables = config.events
    .filter((event) => event.type === ComboEvent.EXTEND)
    .map((event) => {
      return handlePlayerIndexFilter(combo.extend$, event, config.variables).pipe(
        map(
          (payload): EventEmit => ({
            id: event.id,
            type: event.type,
            payload,
          })
        )
      );
    });
  const endObservables = config.events
    .filter((event) => event.type === ComboEvent.END)
    .map((event) => {
      const base$ = handlePlayerIndexFilter(combo.end$, event, config.variables);
      return handleComboFilter(base$, event, config.variables).pipe(
        map(
          (payload): EventEmit => ({
            id: event.id,
            type: event.type,
            payload,
          })
        )
      );
    });
  const conversionObservables = config.events
    .filter((event) => event.type === ComboEvent.CONVERSION)
    .map((event) => {
      const base$ = handlePlayerIndexFilter(combo.conversion$, event, config.variables);
      return handleComboFilter(base$, event, config.variables).pipe(
        map(
          (payload): EventEmit => ({
            id: event.id,
            type: event.type,
            payload,
          })
        )
      );
    });

  const observables: Observable<EventEmit>[] = [
    ...startObservables,
    ...extendObservables,
    ...endObservables,
    ...conversionObservables,
  ];

  return merge(...observables);
};

const handlePlayerIndexFilter = (
  base$: Observable<ComboEventPayload>,
  event: EventConfig,
  variables?: EventManagerVariables
): Observable<ComboEventPayload> => {
  const eventFilter = event.filter as ComboEventFilter;
  if (eventFilter && eventFilter.playerIndex) {
    const value = eventFilter.playerIndex;
    base$ = base$.pipe(filter((payload) => playerFilterMatches(payload.combo.playerIndex, value, variables)));
  }
  return base$;
};

/*
You can set the combo filter from:
- passing it directly as `comboCriteria` parameter in the filter
- setting it as a $ prefixed variable in the variables object and referencing
  that object as a string.
*/
const handleComboFilter = (
  base$: Observable<ComboEventPayload>,
  event: EventConfig,
  variables?: EventManagerVariables
): Observable<ComboEventPayload> => {
  const eventFilter = event.filter as ComboEventFilter;
  let comboSettings = Object.assign({}, defaultComboFilterSettings);
  if (eventFilter && eventFilter.comboCriteria) {
    const options = eventFilter.comboCriteria;
    if (typeof options === "string") {
      if (options.charAt(0) === "$" && exists(variables) && variables[options]) {
        comboSettings = Object.assign(comboSettings, variables[options]);
      } else if (options === "none") {
        // Require explicit specification for no criteria matching
        return base$;
      }
    } else {
      comboSettings = Object.assign(comboSettings, options);
    }
  }
  return base$.pipe(filter((payload) => checkCombo(comboSettings, payload.combo, payload.settings)));
};

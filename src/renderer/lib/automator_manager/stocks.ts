import type { RealTimeStockEvents, StockType } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import type { Observable } from "rxjs";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

import { playerFilter } from "./operators/player";
import type { EventEmit, EventManagerConfig, StockEventFilter } from "./types";
import { StockEvent } from "./types";

export const readStocksConfig = (stocks: RealTimeStockEvents, config: EventManagerConfig): Observable<EventEmit> => {
  return merge(readPlayerSpawnEvents(config, stocks.playerSpawn$), readPlayerDiedEvents(config, stocks.playerDied$));
};

const readPlayerSpawnEvents = (
  eventConfig: EventManagerConfig,
  playerSpawn$: Observable<StockType>
): Observable<EventEmit> => {
  // Handle game start events
  const observables: Observable<EventEmit>[] = eventConfig.events
    .filter((event) => event.type === StockEvent.PLAYER_SPAWN)
    .map((event) => {
      let base$ = playerSpawn$;
      const eventFilter = event.filter as StockEventFilter;

      if (eventFilter && exists(eventFilter.playerIndex)) {
        // Handle num players filter
        for (const filterOption of Object.keys(eventFilter)) {
          switch (filterOption) {
            case "playerIndex":
              base$ = base$.pipe(playerFilter(eventFilter.playerIndex, eventConfig.variables));
              break;
          }
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

const readPlayerDiedEvents = (
  eventConfig: EventManagerConfig,
  playerDied$: Observable<StockType>
): Observable<EventEmit> => {
  // Handle game end events
  const observables: Observable<EventEmit>[] = eventConfig.events
    .filter((event) => event.type === StockEvent.PLAYER_DIED)
    .map((event) => {
      const eventFilter = event.filter as StockEventFilter;
      let base$ = playerDied$;

      if (eventFilter) {
        // Handle num players filter
        if (eventFilter.playerIndex !== undefined) {
          base$ = base$.pipe(playerFilter(eventFilter.playerIndex, eventConfig.variables));
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

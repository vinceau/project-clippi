import type { GameStartType } from "@slippi/slippi-js";
import type { GameEndPayload, RealTimeGameEvents } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import type { Observable } from "rxjs";
import { merge } from "rxjs";
import { filter, map } from "rxjs/operators";

import { playerFilterMatches } from "./operators/player";
import type { EventEmit, EventManagerConfig, GameEndEventFilter, GameStartEventFilter } from "./types";
import { GameEvent } from "./types";

export const readGameConfig = (game: RealTimeGameEvents, config: EventManagerConfig): Observable<EventEmit> => {
  return merge(readGameStartEvents(config, game.start$), readGameEndEvents(config, game.end$));
};

const readGameStartEvents = (
  config: EventManagerConfig,
  gameStart$: Observable<GameStartType>
): Observable<EventEmit> => {
  // Handle game start events
  const observables: Observable<EventEmit>[] = config.events
    .filter((event) => event.type === GameEvent.GAME_START)
    .map((event) => {
      let base$: Observable<GameStartType> = gameStart$;
      const eventFilter = event.filter as GameStartEventFilter;
      if (eventFilter) {
        // Handle num players filter
        if (eventFilter.numPlayers !== undefined) {
          base$ = base$.pipe(filter((settings) => settings.players.length === eventFilter.numPlayers));
        }
        if (eventFilter.isTeams !== undefined) {
          base$ = base$.pipe(filter((settings) => settings.isTeams === eventFilter.isTeams));
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

const readGameEndEvents = (config: EventManagerConfig, gameEnd$: Observable<GameEndPayload>): Observable<EventEmit> => {
  // Handle game end events
  const observables: Observable<EventEmit>[] = config.events
    .filter((event) => event.type === GameEvent.GAME_END)
    .map((event) => {
      let base$: Observable<GameEndPayload> = gameEnd$;
      const eventFilter = event.filter as GameEndEventFilter;
      if (eventFilter) {
        // Handle end method filter
        if (eventFilter.endMethod !== undefined) {
          base$ = base$.pipe(filter((end) => end.gameEndMethod === eventFilter.endMethod));
        }
        const winner = eventFilter.winnerPlayerIndex;
        if (exists(winner)) {
          base$ = base$.pipe(
            filter((payload) => playerFilterMatches(payload.winnerPlayerIndex, winner, config.variables))
          );
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

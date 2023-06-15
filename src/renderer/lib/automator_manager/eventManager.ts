import type { SlpRealTime } from "@vinceau/slp-realtime";
import type { Observable } from "rxjs";
import { merge, ReplaySubject } from "rxjs";
import { switchMap } from "rxjs/operators";

import { readComboConfig } from "./combo";
import { readGameConfig } from "./game";
import { readInputsConfig } from "./inputs";
import { readStocksConfig } from "./stocks";
import type { EventEmit, EventManagerConfig } from "./types";

export class EventManager {
  public realtime: SlpRealTime;
  public events$: Observable<EventEmit>;
  private config$ = new ReplaySubject<EventManagerConfig>();

  public constructor(realtime: SlpRealTime) {
    this.realtime = realtime;
    this.events$ = this.setupSubscriptions();
  }

  public updateConfig(config: EventManagerConfig): void {
    this.config$.next(config);
  }

  private setupSubscriptions(): Observable<EventEmit> {
    return this.config$.pipe(
      switchMap((config) => {
        return merge(
          readGameConfig(this.realtime.game, config),
          readInputsConfig(this.realtime.input, config),
          readStocksConfig(this.realtime.stock, config),
          readComboConfig(this.realtime.combo, config)
        );
      })
    );
  }
}

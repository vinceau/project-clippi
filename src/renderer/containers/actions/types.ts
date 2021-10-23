import type { ActionTypeGenerator } from "@vinceau/event-actions";
import type { FC } from "react";

export interface ActionComponent {
  label: string;
  action: ActionTypeGenerator;
  Icon: FC<any>;
  Component: FC<any>;
  defaultParams?: () => any;
}

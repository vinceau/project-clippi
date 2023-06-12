import type { FC } from "react";

import type { ActionTypeGenerator } from "@/lib/event_actions";

export interface ActionComponent {
  label: string;
  action: ActionTypeGenerator;
  Icon: FC<any>;
  Component: FC<any>;
  defaultParams?: () => any;
}

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { FC } from "react";

export interface ActionComponent {
    label: string;
    action: ActionTypeGenerator;
    snippet: (params: any) => string;
    Icon: FC<any>;
    Component: FC<any>;
}

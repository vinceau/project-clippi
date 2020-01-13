import { ActionTypeGenerator } from "@vinceau/event-actions";
import { FC } from "react";

export interface ActionComponent {
    label: string;
    action: ActionTypeGenerator;
    Icon: FC<any>;
    Component: FC<any>;
    defaultParams?: () => any;
}

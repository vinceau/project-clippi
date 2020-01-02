import { ActionTypeGenerator } from "@vinceau/event-actions";
import { FC } from "react";

export interface ActionComponent {
    label: string;
    action: ActionTypeGenerator;
    Component: FC<any>;
}

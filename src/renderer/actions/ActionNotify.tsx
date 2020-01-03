import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { Form, Icon, TextArea } from "semantic-ui-react";

import { notify } from "@/lib/utils";
import { ActionComponent } from "./types";

interface ActionNotifyParams {
    message: string;
    title?: string;
}

const ActionNotifyFunc: ActionTypeGenerator = (params: ActionNotifyParams) => {
    return async (): Promise<void> => {
        notify(params.message, params.title);
    };
};

const ActionIcon = () => {
    return (
        <Icon name="exclamation circle" size="large" />
    );
};

const NotifyInput = (props: any) => {
    const { value, onChange } = props;
    const defaultValue = value && value.message ? value.message : "";
    const [ msg, setMsg ] = React.useState(defaultValue);
    return (
        <div style={{maxWidth: "500px"}}>
            <Form>
                <TextArea
                    onBlur={() => onChange(({ message: msg }))}
                    value={msg}
                    onChange={(_: any, {value}: any) => setMsg(value)}
                    placeholder="Here's a notification!"
                />
            </Form>
        </div>
    );
};

export const ActionNotify: ActionComponent = {
    label: "show a notification",
    action: ActionNotifyFunc,
    Icon: ActionIcon,
    Component: NotifyInput,
};

import * as React from "react";
import { ActionTypeGenerator } from "@vinceau/event-actions";
import { Form, TextArea } from "semantic-ui-react";
import { notify } from "@/lib/utils";
import { eventActionManager } from "@/lib/actions";

interface ActionComponent {
    action: ActionTypeGenerator;
    Component: React.FC;
}

interface ActionNotifyParams {
    message: string;
    title?: string;
}

const ActionNotifyFunc: ActionTypeGenerator = (params: ActionNotifyParams) => {
    return async (): Promise<any> => {
        notify(params.message, params.title);
    };
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
    action: ActionNotifyFunc,
    Component: NotifyInput,
};

eventActionManager.registerAction("notify", ActionNotify.action);

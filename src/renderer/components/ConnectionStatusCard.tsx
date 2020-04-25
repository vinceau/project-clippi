import * as React from "react";

import styled from "styled-components";

import { Button, Card, Image } from "semantic-ui-react";

import { ScanningDot } from "@/components/ScanningDot";

export const ConnectionStatusCard: React.FC<{
    userImage: any;
    header: string;
    subHeader: string;
    statusColor?: string;
    shouldPulse?: boolean;
    onDisconnect?: () => void;
    buttonText?: string;
}> = props => {
    const handleButtonClick = () => {
        if (props.onDisconnect) {
            props.onDisconnect();
        }
    };
    const color = props.statusColor || "red";
    const StatusSpan = styled.span`
    text-transform: capitalize;
    margin-right: 10px;
    `;
    return (
        <div style={{ padding: "3px" }}>
            <Card>
                <Card.Content>
                    <Image
                        floated="right"
                        size="mini"
                        src={props.userImage}
                    />
                    <Card.Header>
                        <StatusSpan>
                            {props.header}
                        </StatusSpan>
                        <ScanningDot color={color} shouldPulse={props.shouldPulse} />
                    </Card.Header>
                    <Card.Meta>
                        <span>{props.subHeader}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Button basic fluid color="red" onClick={handleButtonClick}>
                        {props.buttonText || "Disconnect"}
                    </Button>
                </Card.Content>
            </Card>
        </div>
    );
};

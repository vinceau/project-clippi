import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { Form } from "@/ui/Form/Form";
import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { Field, FormContainer, Label, PageHeader } from "@/components/Form";
import { connectToOBSAndNotify, obsConnection, OBSConnectionStatus } from "@/lib/obs";
import type { Dispatch, iRootState } from "@/store";
import OBSLogo from "@/styles/images/obs.png";

import { Input } from "@/ui/Input/Input";
import { PasswordInput } from "@/ui/PasswordInput/PasswordInput";
import styles from "./OBSSettings.module.css";

export function OBSSettings() {
  const { obsAddress, obsPort, obsPassword } = useSelector((state: iRootState) => state.slippi);
  const { obsConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
  const obsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;
  const dispatch = useDispatch<Dispatch>();
  const header = obsConnected ? "Connected" : "Disconnected";
  const color = obsConnected ? "#00E461" : "#F30807";
  const subHeader = `${obsAddress}:${obsPort}`;
  return (
    <FormContainer>
      <PageHeader>OBS Configuration</PageHeader>
      {obsConnected ? (
        <ConnectionStatusCard
          header={header}
          subHeader={subHeader}
          userImage={OBSLogo}
          statusColor={color}
          onDisconnect={() => obsConnection.disconnect()}
          shouldPulse={obsConnected}
        />
      ) : (
        <Form onSubmit={connectToOBSAndNotify}>
          <div className={styles.customField}>
            <Field padding="bottom">
              <Label>IP Address</Label>
              <Input
                placeholder="localhost"
                value={obsAddress}
                onChange={(e) => {
                  dispatch.slippi.setOBSAddress(e.target.value);
                }}
              />
            </Field>
            <Field padding="bottom">
              <Label>Port</Label>
              <Input
                placeholder="4444"
                value={obsPort}
                onChange={(e) => {
                  dispatch.slippi.setOBSPort(e.target.value);
                }}
              />
            </Field>
          </div>
          <Field>
            <Label>Websocket Password</Label>
            <PasswordInput
              placeholder="Password"
              value={obsPassword}
              onChange={(e) => {
                dispatch.slippi.setOBSPassword(e.target.value);
              }}
            />
          </Field>
          <div>
            <Button primary type="submit">
              Connect
            </Button>
          </div>
        </Form>
      )}
    </FormContainer>
  );
}

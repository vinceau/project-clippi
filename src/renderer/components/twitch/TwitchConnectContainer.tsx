import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@/ui/Loader/Loader";
import { TwitchConnectButton } from "@/components/twitch";

export function TwitchConnectContainer() {
  const { twitchUser, twitchLoading, twitchDeviceCode } = useSelector((s: any) => s.tempContainer);
  const dispatch = useDispatch();

  if (twitchUser) {
    return null;
  }

  if (twitchLoading) {
    if (twitchDeviceCode) {
      return (
        <div style={{ textAlign: "center", lineHeight: "1.6" }}>
          <p style={{ fontSize: "13px", color: "#bbb", margin: "0 0 12px" }}>
            Go to <strong>{twitchDeviceCode.verificationUri}</strong> and enter code:
          </p>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "28px",
              fontWeight: "bold",
              letterSpacing: "6px",
              color: "#fff",
              background: "#1a1a2e",
              borderRadius: "6px",
              padding: "12px 20px",
              display: "inline-block",
            }}
          >
            {twitchDeviceCode.userCode}
          </div>
        </div>
      );
    }

    return <Loader active inline content="Loading" />;
  }

  return <TwitchConnectButton onClick={() => dispatch({ type: "tempContainer/authenticateTwitch" })} />;
}

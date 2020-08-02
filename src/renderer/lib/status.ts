import { ConnectionStatus } from "@vinceau/slp-realtime";

export const statusToLabel = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.DISCONNECTED:
      return "disconnected";
    case ConnectionStatus.CONNECTING:
      return "connecting";
    case ConnectionStatus.CONNECTED:
      return "connected";
    case ConnectionStatus.RECONNECT_WAIT:
      return "reconnecting";
    default:
      return "unknown";
  }
};

export const statusToColor = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.DISCONNECTED:
      return "#888888";
    case ConnectionStatus.CONNECTING:
    case ConnectionStatus.RECONNECT_WAIT:
      return "#FFB424";
    default:
      return "#00E461";
  }
};

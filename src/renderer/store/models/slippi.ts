import { createModel } from '@rematch/core';
import { produce } from 'immer';
import { ConnectionStatus } from '../../../shared/slippi';

export interface SlippiState {
    port: string;
    connectionStatus: ConnectionStatus;
}

const initialState: SlippiState = {
    port: '',
    connectionStatus: ConnectionStatus.DISCONNECTED
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setPort: (state: SlippiState, payload: string): SlippiState =>
            produce(state, draft => {
                draft.port = payload;
            }),
        updateConnectionStatus: (state: SlippiState, payload: ConnectionStatus): SlippiState =>
            produce(state, draft => {
                draft.connectionStatus = payload;
            })
    }
});

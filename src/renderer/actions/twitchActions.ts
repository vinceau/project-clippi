import { Action, ActionCreator } from 'redux';

export const TwitchSetToken = 'TwitchSetToken';

export interface TwitchSetTokenAction extends Action {
    type: typeof TwitchSetToken;
    accessToken: string;
}
export const twitchSetToken: ActionCreator<TwitchSetTokenAction> = (token: string) => ({
    type: TwitchSetToken,
    accessToken: token
});

export type TwitchAction = TwitchSetTokenAction;

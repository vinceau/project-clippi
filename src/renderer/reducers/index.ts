import { combineReducers } from 'redux';

import { counterReducer } from './counterReducer';
import { twitchReducer } from './twitchReducer';

export const rootReducer = combineReducers({
    counter: counterReducer,
    twitch: twitchReducer
});

export type RootState = ReturnType<typeof rootReducer>;

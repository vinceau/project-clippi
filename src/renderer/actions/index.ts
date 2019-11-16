import { CounterAction } from './counterActions';
import { TwitchAction } from './twitchActions';

export type RootActions = TwitchAction[keyof TwitchAction] | CounterAction[keyof CounterAction];

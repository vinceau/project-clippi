import * as React from 'react';
import { connect } from 'react-redux';
import { iRootState, Dispatch } from '../store/rematch';

const scopes = ['user_read', 'clips:edit'];

const Count: React.FC<CountProps> = props => (
    <div>
        {props.authToken ? (
            <h1>{props.authToken}</h1>
        ) : (
            <button onClick={e => props.fetchAuthToken!(scopes)}>authenticate with twitch</button>
        )}
        The count is {props.count}
        <button onClick={props.increment}>increment</button>
        <button onClick={props.incrementAsync}>incrementAsync</button>
    </div>
);

const mapState = (state: iRootState) => ({
    count: state.sharks,
    authToken: state.twitch.authToken
});

const mapDispatch = (dispatch: Dispatch) => {
    console.log(dispatch);
    return {
        increment: () => dispatch.sharks.increment(1),
        fetchAuthToken: (scopes: string | string[]) => dispatch.twitch.fetchTwitchToken(scopes),
        incrementAsync: () => dispatch.sharks.incrementAsync(1)
    };
};

interface CountProps
    extends Partial<ReturnType<typeof mapState>>,
        Partial<ReturnType<typeof mapDispatch>> {}

export const CountContainer = connect(mapState, mapDispatch as any)(Count);

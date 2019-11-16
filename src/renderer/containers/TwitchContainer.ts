import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { RootState } from '../reducers';
import { TwitchAction, twitchSetToken } from '../actions/twitchActions';
import { TwitchConnect } from '../components/TwitchConnect/TwitchConnect';

const mapStateToProps = (state: RootState) => ({
    accessToken: state.twitch.accessToken
});

// const mapDispatchToProps = (dispatch: Dispatch<TwitchAction>) => ({
//     setAccessToken: () => dispatch(twitchSetToken()),
// });

export default connect(mapStateToProps)(TwitchConnect);

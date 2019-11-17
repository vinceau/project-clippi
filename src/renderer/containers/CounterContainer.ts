import { connect } from 'react-redux';

import Counter from '../components/Counter';
import { RootState } from '../reducers';
import { decrement, increment } from '../actions/counterActions';

const mapStateToProps = (state: RootState) => ({
    value: state.counter.value
});

const mapDispatchToProps = {
    incrementValue: increment,
    decrementValue: decrement
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

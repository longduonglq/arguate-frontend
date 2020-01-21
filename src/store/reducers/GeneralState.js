import * as actionType from '../actions/types';

const initState = {};
const setChatState = (action, state) => {
    return Object.assign({}, state, {
        [state.field]: state.info
    });
};

const reducer = (state = initState, action) => {
    switch(action.type){
        case actionType.SET_GENERAL_INFO:
            return setChatState(state, action);
            break;
        default:
            return state;
            break;
    }
};

export default reducer;
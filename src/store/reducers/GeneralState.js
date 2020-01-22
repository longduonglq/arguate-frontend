import * as actionType from '../actions/types';

const initState = {};
const setChatState = (state, action) => {
    return Object.assign({}, state, {
        [action.field]: action.info
    });
};

const reducer = (state = initState, action) => {
    switch(action.type){
        case actionType.SET_GENERAL_INFO:
            return setChatState(state, action);
        default:
            return state;
    }
};

export default reducer;
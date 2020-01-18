import * as actionType from '../actions/types';
import {chatStates} from "../actions/types";

const initState = {
    state: chatStates.rest,
    extra: null
};

const setChatState = (state, action) => {
    return Object.assign({}, state, {
        state: action.state,
        extra: action.extra
    });
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.SET_CHAT_STATE:
            return setChatState(state, action);
        default:
            return state;
    }
};

export default reducer;
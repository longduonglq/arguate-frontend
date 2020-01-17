import * as actionType from '../actions/types';

export const newMsg = (id, msg) => {
    return {
        type: actionType.NEW_MSG,
        msg: msg,
        id: id
    };
};

export const clearMsg = () => {
    return {
        type: actionType.CLEAR_MSG,
    };
};

export const setTypingState = (state) => {
    return {
        type: actionType.SET_TYPING_STATE,
        state: state
    };
};
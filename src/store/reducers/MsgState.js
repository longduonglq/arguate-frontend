import * as actionType from '../actions/types';
import {Message} from 'react-chat-ui';
const initState = {
    msgs: [],
    typingState: false
};

const newMsg = (state, action) => {
    return Object.assign({}, state, {
        msgs: [
            ...state.msgs,
            new Message({id: action.id, message: action.msg}) 
        ]
    });
};

const clearMsg = (state, action) => {
    return Object.assign({}, state, {
        msgs: []
    });
};

const setTypingState = (state, action) => {
    return Object.assign({}, state, {
        typingState: action.state
    });
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.NEW_MSG:
            return newMsg(state, action);
        case actionType.CLEAR_MSG:
            return clearMsg(state, action);
        case actionType.SET_TYPING_STATE:
            return setTypingState(state, action);
        default:
            return state;
    }
};

export default reducer;
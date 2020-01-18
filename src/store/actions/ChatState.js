import * as action from './types';

export const setChatState = (state, extra=null) => {
    return {
        type: action.SET_CHAT_STATE,
        state: state,
        extra: extra // if state is success, this should indicate topic
    };
};

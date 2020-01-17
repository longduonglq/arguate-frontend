import * as action from './types';

export const setLookingState = (state) => {
    return {
        type: action.SET_LOOKING_STATE,
        state: state
    };
};

export const setLookingResult = (result, extra=null) =>{
    return {
        type: action.SET_LOOKING_RESULT,
        result: result,
        resultExtra: extra
    }
};

export const setChattingState = (state) => {
    return {
        type: action.SET_CHATTING_STATE,
        state: state
    };
};

export const setDisconnectInfo = (info) => {
    return {
        type: action.SET_DISCONNECT_INFO,
        info: info
    };
};

export const setCurTopic = (topic, opinion) => {
    return {
        type: action.SET_CUR_TOPIC,
        topic: [topic, opinion] 
    };
};
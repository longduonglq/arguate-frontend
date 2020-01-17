import * as actionType from '../actions/types';
import {disconnectInfo} from "../../components/ChatUI";

const initState = {
    isChatting: false,
    isLooking: false,
    lookingResult: null,
    resultExtra: null,
    curTopic: null,
    disconnectInfo: disconnectInfo.init,
};

const setLookingState = (state, action) => {
    return Object.assign({}, state, {
        isLooking: action.state
    });
};

const setLookingResult = (state, action) => {
    return Object.assign({}, state, {
        lookingResult: action.result,
        resultExtra: action.resultExtra
    });
};

const setDisconnectInfo = (state, action) => {
    return Object.assign({}, state, {
        disconnectInfo: action.info
    });
};

const setChattingState = (state, action) => {
    return Object.assign({}, state, {
        isChatting: action.state
    });
};

const setCurTopic = (state, action) => {
    return Object.assign({}, state, {
        curTopic: action.topic
    })
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.SET_LOOKING_STATE:
            return setLookingState(state, action);
        case actionType.SET_LOOKING_RESULT:
            return setLookingResult(state, action);
        case actionType.SET_CHATTING_STATE:
            return setChattingState(state, action);
        case actionType.SET_CUR_TOPIC:
            return setCurTopic(state, action);
        case actionType.SET_DISCONNECT_INFO:
            return setDisconnectInfo(state, action);
        default:
            return state;
    }
};

export default reducer;
import * as actionType from '../actions/types';

const initState = {
    topics: [],
};

const setTopics = (state, action ) => {
    return {
        ...state,
        topics: action.topics
    }
};

const addTopic = (state, action) => {
    for (let i = 0; i < state.topics.length; i++ ){
        if (state.topics[i] === action.topic) return state;
    }
    return {
        topics: [
            ...state.topics,
            [action.topic, true]
        ]
    };
};

const toggleTopic = (state, action) => {
    return {
        topics: state.topics.map((item, index) => {
            if (item[0] === action.topic){
                return [item[0], !item[1]];
            }
            else return item;
        })
    };
};

const deleteTopic = (state, action) => {
    return {
        topics: state.topics.filter((value, index) => {
            return value[0] !== action.topic;
        })
    };
};

const reducer = (state = initState, action) => {
    switch(action.type){
        case actionType.SET_TOPICS:
            return setTopics(state, action);
        case actionType.ADD_TOPIC:
            return addTopic(state, action);
        case actionType.TOGGLE_TOPIC:
            return toggleTopic(state, action);
        case actionType.DELETE_TOPIC:
            return deleteTopic(state, action);
        default:
            return state;
    }
};

export default reducer;


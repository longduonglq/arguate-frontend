import * as action from './types';

export const setTopics = (topics) => {
    return {
        type: action.SET_TOPICS,
        topics: topics
    };
};

export const addTopic = (topic) => {
    return {
        type: action.ADD_TOPIC,
        topic: topic
    };
};

export const toggleTopic = (topic) => {
    return {
        type: action.TOGGLE_TOPIC,
        topic: topic
    };
};

export const deleteTopic = (topic) => {
    return {
        type: action.DELETE_TOPIC,
        topic: topic
    };
};
export const NEW_MSG = 'new-msg';
export const CLEAR_MSG = 'clear-msg';
export const SET_TYPING_STATE = 'set-typing-state';

export const ADD_TOPIC =  'add-topic';
export const TOGGLE_TOPIC = 'toggle-topic';
export const DELETE_TOPIC = 'delete-topic';
export const SET_TOPICS = 'set-topics';

export const SET_ACTIVE_TAB = 'set-active-tab';

export const SET_CHAT_STATE = 'set-chat-state';
export const chatStates = {
    rest: 'rest',
    
    isLooking: 'is-looking',
    lookingSuccess: 'looking-success',
    lookingFailed_NOP: 'looking-failed-no-opponents',
    lookingFailed_SER: 'looking-failed-server-error',
    lookingFailed_USR: 'looking-failed-user-stopped',
    
    isChatting: 'is-chatting',
    userDisconnect: 'user-disconnect',
    otherDisconnect: 'other-disconnect',
};

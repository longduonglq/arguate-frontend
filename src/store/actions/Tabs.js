import * as action from './types';

export const setActiveTab = (tab) => {
    return {
        type: action.SET_ACTIVE_TAB,
        tab: tab
    }
};
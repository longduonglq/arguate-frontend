import * as action from './types';

export const setGeneralState = (field, info) => {
    return {
        type: action.SET_GENERAL_INFO,
        field: field,
        info: info
    }
};
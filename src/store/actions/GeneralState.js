import * as action from './types';

export const setGeneralState = (field, info) => {
    return {
        field: field,
        info: info
    }
};
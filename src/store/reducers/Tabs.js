import * as actionType from '../actions/types';

const initState = {
    tab: 0,
};

const setActiveTab = (state, action) => {
    return Object.assign({}, state, {
        tab: action.tab
    });
};

const reducer = (state = initState, action) => {
    switch (action.type){
        case actionType.SET_ACTIVE_TAB:
            return setActiveTab(state, action);
        default:
            return state;
    }
};

export default reducer;
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import {Provider} from 'react-redux';
import { createStore, combineReducers } from "redux";
import {devToolsEnhancer, composeWithDevTools} from 'redux-devtools-extension';

import chatReducer from './store/reducers/ChatState';
import msgReducer from './store/reducers/MsgState';
import topicReducer from './store/reducers/TopicState';
import tabReducer from './store/reducers/Tabs';
import generalReducer from './store/reducers/GeneralState';
import * as generalAction from './store/actions/GeneralState';
import GWebsocket from "./websocket";
import rdWebsocket from "./rdWebsocket";
import sendHttp from "./utility";
import {setTopics} from "./store/actions/TopicState";
import initVisibilityNotif from "./visibility";
import NoWebsocket from "./components/NoWebsocketErrorPage";

function configureStore(){
    const rootReducer = combineReducers({
        chat: chatReducer,
        msg: msgReducer,
        topic: topicReducer,
        tab: tabReducer,
        general: generalReducer
    });

    const composerEnhancer = composeWithDevTools({
        name: `Redux`,
        realtime: true,
        trace: true,
        traceLimit: 25
    });
    const store = createStore(
        rootReducer,
        composerEnhancer()
    );

    return store;
}
export const store = configureStore();
const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);

// set admin or not
store.dispatch(generalAction.setGeneralState('admin', false));
if (localStorage.getItem('admin') !== undefined &&
    localStorage.getItem('admin') === 'true') {
    store.dispatch(generalAction.setGeneralState('admin', true));
}

GWebsocket.addCallback('user_id_confirmed', (data) => {
    sendHttp('user_topics', {
        user_id: localStorage.getItem('user_id'),
    }).then(res => {
        var raw = JSON.parse(res);
        store.dispatch(setTopics(raw['topics']));
        ReactDOM.render(app, document.getElementById('root'));
        initVisibilityNotif(store);
    })
});
GWebsocket.connect();
const rdws = new rdWebsocket();
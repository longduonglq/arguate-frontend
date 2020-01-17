import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import {Provider} from 'react-redux';
import { createStore, combineReducers } from "redux";
import {devToolsEnhancer} from 'redux-devtools-extension';

import chatReducer from './store/reducers/ChatState';
import msgReducer from './store/reducers/MsgState';
import topicReducer from './store/reducers/TopicState';
import tabReducer from './store/reducers/Tabs';
import GWebsocket from "./websocket";
import sendHttp from "./utility";
import {setTopics} from "./store/actions/TopicState";

function configureStore(){
    const rootReducer = combineReducers({
        chat: chatReducer,
        msg: msgReducer,
        topic: topicReducer,
        tab: tabReducer
    });

    const store = createStore(
        rootReducer,
        devToolsEnhancer()
    );

    return store;
}
export const store = configureStore();
const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);

GWebsocket.addCallback('user_id_confirmed', () => {
    sendHttp('user_topics', {
            user_id: localStorage.getItem('user_id'),
    }).then(res => {
            var raw = JSON.parse(res);
            store.dispatch(setTopics(raw['topics']));
            ReactDOM.render(app, document.getElementById('root'));
    });
});
GWebsocket.connect();
import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import {connect} from 'react-redux';

import ChatUI from './components/ChatUI';
import {EscBtn, btnState} from "./components/EscBtn";
import Textarea from "./components/Textarea";
import SearchBar from './components/SearchBar';
import { ChatFeed, Message } from 'react-chat-ui';
import TopicsUI from "./components/TopicsUI";
import MainUI from './components/MainUI';
import GWebsocket from "./websocket";
import sendHttp from "./utility";
import * as topicAction from './store/actions/TopicState';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <MainUI/>
            </div>
        );
    }
}

export default App;

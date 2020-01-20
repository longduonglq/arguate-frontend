import React from 'react';
import logo from './logo.svg';
import './styles/App.css';
import {connect} from 'react-redux';

import {EscBtn, btnState} from "./components/EscBtn";
import MainUI from './components/MainUI';


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

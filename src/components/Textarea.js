import React from 'react';
import {connect} from 'react-redux';
import * as msgAction from '../store/actions/MsgState';
import {Diff, diffChars} from 'diff';

import GConfig from "../GConfig";
import '../styles/Textarea.css';
import GWebsocket from "../websocket";

function isEmptyOrSpaces(str){
    return str === null || str.match(/^\s*$/) !== null;
}

class Textarea extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
        };
        this.interval = null;
        this.lastInputValue = '';
        this.lastReturnValue = null;
    }

    componentDidMount = () => {
        this.interval = setInterval(() => {
            this.checkInputChange(this.state.inputValue);
        }, GConfig.ChatUI.user_typing_pulse);
    };
    
    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    checkInputChange = (inputValue) => {
        var curRet;
        if (inputValue === this.lastInputValue) {
            curRet = false;
        } else {
            this.lastInputValue = inputValue;
            curRet = true;
        }
        if (inputValue === '') curRet = false;
        if (curRet !== this.lastReturnValue) {
            if (this.props.isChatting) {
                GWebsocket.send_typing_status(curRet);
            }
            this.lastReturnValue = curRet;
        }
    };

    handleInputChange = (event) => {
        this.setState({inputValue: event.target.value});
    };

    onKeyPress = (event) => {
        if (event.shiftKey && event.charCode === 13) return true;
        if (event.charCode === 13){
            this.trySendMsg();
            event.preventDefault();
            return false;
        }
    };
    
    trySendMsg = () => {
       if (!isEmptyOrSpaces(this.state.inputValue)){
           this.props.sendMsg(this.state.inputValue);
           GWebsocket.send_msg_to(this.state.inputValue);
       }
       this.setState({inputValue: ''});
    };

    render() {
        return (
            <textarea
                value={this.state.inputValue}
                className='message-input'
                style={{fontWeight: GConfig.ChatUI.fontWeight}}
                maxLength={500}
                autoFocus={true}
                disabled={!this.props.isChatting}
                onKeyPress={this.onKeyPress}
                onChange={this.handleInputChange}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isChatting: state.chat.isChatting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTypingState: (state) => dispatch(msgAction.setTypingState(state)),
        sendMsg: (msg) => dispatch(msgAction.newMsg(0, msg))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Textarea);

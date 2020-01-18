import React from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import {orange, red} from '@material-ui/core/colors';
import {connect} from 'react-redux';

import GConfig from "../GConfig";
import * as msgAction from '../store/actions/MsgState';
import TopicsUI from "./TopicsUI";
import Feedback from "./Feedback";
import GWebsocket from "../websocket";
import Textarea from "./Textarea";
import EscBtn from "./EscBtn";
import {chatStates} from "../store/actions/types";

import '../styles/ChatUI.css';
import '../styles/MainUI_style.css';

var bubbleStyles = {
    text: {
        fontSize: 17,
        fontWeight: GConfig.ChatUI.fontWeight,
    },
    chatbubble: {
        borderRadius: 10,
        padding: 10,
        maxWidth: 500,
    }
};

var empty  = () => {return <div></div>};
class ChatUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayTopMsg: false,
            topMsg: () => {return <div></div>},
            displayBottomMsg: false,
            bottomMsg: () => {return <div></div>},
        };

        this.chatStateSnap = null;
    }

    componentDidMount() {
         this.propagateChatState(this.props.chatState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.chatStateSnap === this.props.chatState) return;
        else this.chatStateSnap = this.props.chatState;
        if (this.props.chatState !== prevState.chatState){
            this.propagateChatState(this.props.chatState, this.props.chatStateExtra);
        }
    }

    propagateChatState(state, extra=null){
        switch (state){
            case chatStates.rest:
                break;
            case chatStates.isLooking:
                this.isLooking();
                break;
            case chatStates.lookingSuccess:
                this.lookingSuccess();
                break;
            case chatStates.lookingFailed_NOP:
                this.failed_noOpponent();
                break;
            case chatStates.lookingFailed_SER:
                this.failed_serverError();
                break;
            case chatStates.lookingFailed_USR:
                GWebsocket.stop_start_chat();
                this.failed_disconnect('You\'ve');
                break;
            case chatStates.userDisconnect:
                this.failed_disconnect('You\'ve');
                break;
            case chatStates.otherDisconnect:
                this.failed_disconnect('Other use has');
                break;
            default:
                console.log('default switch in propagateChatState');
                break;
        }
    }

    isLooking = () => {
        this.props.clearMsg();
        this.setState({
            displayBottomMsg: false,
            displayTopMsg: true,
            topMsg: () => {
                return (
                    <div>
                        <i
                            style={{color: orange[800], fontWeight: 500}}>
                            Finding someone who disagrees with you...
                        </i>
                    </div>
                );
            }
        });
    };

    lookingSuccess = () => {
        function displayOpinion(props){
            if (!props[1]){
                return (
                    <span style={{color:'red', fontWeight: 500}}>Against:
                        <span style={{color:'red', fontWeight: 600}}> {props[0]}</span>
                    </span>
                );
            } else {
                return (
                    <span style={{color:'green', fontWeight: 500}}>Support:
                        <span style={{color:'green', fontWeight: 600}}> {props[0]}</span>
                    </span>
                );
            }
        }
        this.setState({
            displayBottomMsg: false,
            displayTopMsg: true,
            topMsg: () => {
                return (
                    <div style={{fontWeight: 500}}>
                        You are <span style={{color: 'green'}}>connected</span> to
                        a random user ({displayOpinion(this.props.topic)}). 
                    </div>
                );
            }
        });
    };

    failed_noOpponent = () => {
        GWebsocket.end_chat();
        this.setState({
            displayBottomMsg: true,
            bottomMsg: () => {return(
                <div style={{fontWeight: 400}}>
                    <span style={{color: red[400], fontWeight: 500}}>
                    Couldn't find any available user right now. Please try again
                    and maybe add more opinions.</span>
                    <div style={{marginTop: 13,
                        borderRadius: GConfig.TopicUI.borderRadius,
                        backgroundColor: GConfig.TopicUI.planeBackgroundColor}}>
                        <TopicsUI/>
                    </div>
                    <Feedback/>
                </div>
            )}
        });
    };

    failed_disconnect = (who) => {
        this.setState({
            displayBottomMsg: true,
            bottomMsg: () => {
                return (
                    <div>
                        <span style={{color:'red', fontWeight: 600}}>
                            {who} disconnected
                        </span>
                        <div style={{marginTop: 13,
                        borderRadius: GConfig.TopicUI.borderRadius,
                        backgroundColor: GConfig.TopicUI.planeBackgroundColor}}>
                            <TopicsUI/>
                        </div>
                        <Feedback/>
                    </div>
                );
            }
        });
    };

    failed_serverError = () => {
        this.setState({
            displayTopMsg: true,
            topMsg: () => {
                return (
                    <div style={{fontWeight: 400}}>
                        Could not connect to server. Please try again or report the error.
                        <div style={{marginTop: 13,
                        borderRadius: GConfig.TopicUI.borderRadius,
                        backgroundColor: GConfig.TopicUI.planeBackgroundColor}}>

                            <TopicsUI/>
                        </div>
                        <Feedback/>
                    </div>
                );
            }
        });
    };

    render() {
        return (
            <div className='chatfeed-wrapper' style={{flexGrow: 1}}>
                <ChatFeed
                    maxHeight={250}
                    messages={this.props.messages}
                    showSenderName
                    bubbleStyles={bubbleStyles}

                    isTyping={this.props.isTyping}
                    typingMsg={
                        <i>Other user is typing...</i>
                    }

                    empty={this.state.displayTopMsg}
                    extraMsg={this.state.topMsg()} // msg appears on top

                    showEnd={this.state.displayBottomMsg}
                    showEndMsg={this.state.bottomMsg()}
                />

                <div className='input-group'>
                    <EscBtn/>
                    <Textarea/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        messages: state.msg.msgs,
        isTyping: state.msg.typingState,
        chatState: state.chat.state,
        chatStateExtra: state.chat.extra,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        newMsg: (msg) => dispatch(msgAction.newMsg(msg)),
        clearMsg: () => dispatch(msgAction.clearMsg())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatUI);

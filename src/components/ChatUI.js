import React from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {orange, red} from '@material-ui/core/colors';
import {connect} from 'react-redux';

import GConfig from "../GConfig";
import * as msgAction from '../store/actions/MsgState';
import TopicsUI from "./TopicsUI";
import Feedback from "./Feedback";
import GWebsocket from "../websocket";
import Textarea from "./Textarea";
import EscBtn from "./EscBtn";

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

export const lookingResult = {
    success: 'success',
    failed_noOpponent: 'failed-no-opponents',
    failed_disconnect: 'failed-disconnect',
    failed_serverError: 'failed-server-error'
};

export const disconnectInfo = {
    init: 'init', //not really disconnected
    other: 'other',
    user: 'user'
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
    }

    componentDidMount() {
        if (this.props.isLooking) {
                this.isLooking();
            } else {
                switch (this.props.lookingResult) {
                    case lookingResult.success:
                        this.lookingSuccess();
                        break;
                    case lookingResult.failed_noOpponent:
                        this.failed_noOpponent();
                        break;
                    case lookingResult.failed_disconnect:
                        this.failed_disconnect();
                        break;
                    case lookingResult.failed_serverError:
                        this.failed_serverError();
                        break;
                    default:
                        break;
                }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isLooking !== prevProps.isLooking 
            || this.props.lookingResult !== prevProps.lookingResult) {
            if (this.props.isLooking) {
                this.isLooking();
            } else {
                switch (this.props.lookingResult) {
                    case lookingResult.success:
                        this.lookingSuccess();
                        break;
                    case lookingResult.failed_noOpponent:
                        this.failed_noOpponent();
                        break;
                    case lookingResult.failed_disconnect:
                        this.failed_disconnect('You\'ve');
                        break;
                    case lookingResult.failed_serverError:
                        this.failed_serverError();
                        break;
                    default:
                        break;
                }
            }
        }
        if (this.props.isChatting !== prevProps.isChatting
            || this.props.disconnectInfo !== prevProps.disconnectInfo){
            if (!this.props.isChatting && this.props.disconnectInfo !== disconnectInfo.init){
                if (this.props.disconnectInfo === disconnectInfo.user){
                    this.failed_disconnect('You\'ve');
                } else if (this.props.disconnectInfo === disconnectInfo.other){
                    this.failed_disconnect('Other user has');
                }
            }
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
                        a random user ({displayOpinion(this.props.topic)})
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
        isLooking: state.chat.isLooking,
        lookingResult: state.chat.lookingResult,
        resultExtra: state.chat.resultExtra,
        isChatting: state.chat.isChatting,
        disconnectInfo: state.chat.disconnectInfo,
        topic: state.chat.curTopic
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

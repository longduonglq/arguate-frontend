import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import GConfig from "../GConfig";
import * as chatAction from '../store/actions/ChatState';
import {setLookingState} from "../store/actions/ChatState";
import {connect} from 'react-redux';

import '../styles/ChatUI.css';
import GWebsocket from "../websocket";

export const btnState = {
    start: 0,
    quit: 1,
    really: 2
};

const lookingResult = {
    success: 'success',
    failed_noOpponent: 'failed-no-opponents',
    failed_disconnect: 'failed-disconnect',
    failed_serverError: 'failed-server-error'
};

class EscBtn extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            variant: 'outlined',
            btnColor: GConfig.Global.buttonColor,
            escBtnStyle: null,
            escBtnText: null,

            escBtnState: this.props.state
        };
        this.handleEscClick = this.handleEscClick.bind(this);
        this.setBtnState = this.setBtnState.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    handleEscClick(event){
        this.setState({
            escBtnState: (this.state.escBtnState + 1) % 3
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.escBtnState !== prevState.escBtnState){
            this.setBtnState(this.state.escBtnState);
        }
        if (this.props.isChatting !== prevProps.isChatting ||
            this.props.isLooking !== prevProps.isLooking) {
            if (this.props.isLooking || this.props.isChatting)
                this.setState({escBtnState: btnState.quit});
            else {
                this.setState({escBtnState: btnState.start});
            }
        }
    }

    setBtnState(status){
        // propagate props 'status' to other internal state update
        switch(status){
            case btnState.start:
                this.setState({
                    escBtnStyle: {backgroundColor: GConfig.Global.buttonColor, color: 'white'},
                    escBtnText: 'Start\n(ESC)'
                });
                // user just press quit
                if (this.props.isLooking) {
                    this.props.setLookingState(false);
                    this.props.setDisconnectInfo('user');
                    GWebsocket.stop_start_chat();
                }
                if (this.props.isChatting) {
                    this.props.setChattingState(false);
                    this.props.setDisconnectInfo('user');
                    GWebsocket.end_chat();
                }
                break;
            case btnState.quit:
                this.setState({
                    escBtnStyle: {},
                    escBtnText: 'Quit\n(ESC)'
                });
                this.props.setDisconnectInfo('init');
                this.props.setLookingResult(null);
                if (!this.props.isLooking) {
                    this.props.setLookingState(true);
                    GWebsocket.start_chat((data, status) => {
                        switch(status) {
                            case 'success':
                                this.props.setLookingState(false);
                                this.props.setChattingState(true);
                                this.props.setLookingResult(lookingResult.success);
                                break;
                            case 'no-opponents':
                                this.props.setLookingState(false);
                                this.props.setChattingState(false);
                                this.props.setLookingResult(lookingResult.failed_noOpponent);
                                break;
                            case 'unexpected-error':
                                this.props.setLookingState(false);
                                this.props.setChattingState(false);
                                this.props.setLookingResult(lookingResult.failed_serverError);
                                break;
                            default:
                                break;
                        }
                    });
                }
                break;
            case btnState.really:
                this.setState({
                    escBtnStyle: {backgroundColor: GConfig.Global.warningBtnColor, color: 'white'},
                    escBtnText: 'Really?\n(ESC)'
                });
                break;
            default:
                break;
        }
    }

    handleKeydown(event){
        if (event.keyCode === 27) this.handleEscClick();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown, false);
        var initState = null;
        if (this.props.isLooking || this.props.isChatting) initState = btnState.quit;
        else if (!this.props.isLooking) initState = btnState.start;
        this.setState({escBtnState: initState});
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown, false);
    }

    render() {
        return (
            <Button
                variant={this.state.variant}
                color={this.state.btnColor}
                style={this.state.escBtnStyle}
                onClick={this.handleEscClick}
                disableElevation
            >
                {this.state.escBtnText}
            </Button>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLooking: state.chat.isLooking,
        isChatting: state.chat.isChatting,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setChattingState: (state) => dispatch(chatAction.setChattingState(state)),
        setLookingState: (state) => dispatch(chatAction.setLookingState(state)),
        setLookingResult: (result, extra) => dispatch(chatAction.setLookingResult(result, extra)),
        setDisconnectInfo: (info) => dispatch(chatAction.setDisconnectInfo(info))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EscBtn);


import React from 'react';
import Button from '@material-ui/core/Button';
import GConfig from "../GConfig";
import * as chatAction from '../store/actions/ChatState';
import {connect} from 'react-redux';

import '../styles/ChatUI.css';
import {chatStates} from '../store/actions/types';

export const btnState = {
    start: 0,
    quit: 1,
    really: 2
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

        this.stateSnap = [null, null];
    }

    handleEscClick(event){
        this.setState({
            escBtnState: (this.state.escBtnState + 1) % 3
        });
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown, false);
        switch (this.props.chatState){
            case chatStates.rest:
                break;
            case chatStates.isLooking:
                this.setState({escBtnState: btnState.quit});
                break;
            case chatStates.lookingFailed_NOP:
            case chatStates.lookingFailed_SER:
            case chatStates.lookingFailed_USR:
                this.setState({escBtnState: btnState.start});
                break;
            case chatStates.userDisconnect:
            case chatStates.otherDisconnect:
                this.setState({escBtnState: btnState.start});
                break;
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown, false);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.escBtnState !== prevState.escBtnState){
            this.setBtnState(this.state.escBtnState);
        }

        if (this.stateSnap[0] === this.props.chatState &&
            this.stateSnap[1] === prevState.chatState){
            return;
        } else this.stateSnap = [this.props.chatState, prevState.chatState];
        if (this.props.chatState !== prevState.chatState){
            switch(this.props.chatState){
                case chatStates.rest:
                    break;
                case chatStates.isLooking:
                    this.setState({escBtnState: btnState.quit});
                    break;
                case chatStates.lookingFailed_NOP:
                case chatStates.lookingFailed_SER:
                case chatStates.lookingFailed_USR:
                    this.setState({escBtnState: btnState.start});
                    break;
                case chatStates.userDisconnect:
                case chatStates.otherDisconnect:
                    this.setState({escBtnState: btnState.start});
                    break;
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
                if (this.props.chatState === chatStates.isLooking) {
                    this.props.setChatState(chatStates.lookingFailed_USR);
                }
                else if (this.props.chatState === chatStates.isChatting){
                    this.props.setChatState(chatStates.userDisconnect);
                }
                console.log('escBtn: someone disconnected');
                break;
            case btnState.quit:
                this.setState({
                    escBtnStyle: {},
                    escBtnText: 'Quit\n(ESC)'
                });
                this.props.setChatState(chatStates.isLooking);
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
        chatState: state.chat.state,
        chatStateExtra: state.chat.extra
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setChatState: (state, extra) => dispatch(chatAction.setChatState(state, extra)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EscBtn);


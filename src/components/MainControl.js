import React from 'react';
import SearchBar from "./SearchBar";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import {connect} from 'react-redux';

import GConfig from "../GConfig";
import TopicsUI from "./TopicsUI";
import * as chatAction from '../store/actions/ChatState';
import * as tabAction from '../store/actions/Tabs';

import '../styles/MainUI_style.css';
import GWebsocket from "../websocket";

// this is for tooltip styling
const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 15,
        color: "white",
      }
    }
  }
});

const lookingResult = {
    success: 'success',
    failed_noOpponent: 'failed-no-opponents',
    failed_disconnect: 'failed-disconnect',
    failed_serverError: 'failed-server-error'
};

class Control extends React.Component{
    constructor(props) {
        super(props);
    }

    handleStartChatClick = () => {
        this.props.setDisconnectInfo('init');
        this.props.setLookingResult(null);
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
        this.props.setCurrentTab(1);
    };
    
    render() {
        return (
            <div>
                <div style={{paddingLeft: 28, paddingRight: 28}}>
                    <SearchBar />
                </div>

            <div align='center'>
                <MuiThemeProvider theme={theme}>
                <Tooltip title={this.props.topics.length > 0 ? '': 'You must first choose at least one topic'}>
                <div>
                    <Button variant='contained'  size='large' fullWidth={true} color='primary'
                        style={{backgroundColor: this.props.topics.length > 0? GConfig.Global.buttonColor: GConfig.Global.disableButtonColor,
                                color: 'white', width: 300, height: 60, marginTop: 20,
                                fontSize: 25}}
                        disabled={!(this.props.topics.length > 0)}
                        onClick={this.handleStartChatClick}
                        >
                    Start Chat
                    </Button>
                </div>
                </Tooltip>
                </MuiThemeProvider>
            </div>
            <div style={{margin: 28,
                        borderRadius: GConfig.TopicUI.borderRadius,
                        backgroundColor: GConfig.TopicUI.planeBackgroundColor}}>

                <TopicsUI/>
            </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        topics: state.topic.topics,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setLookingState: (state) => dispatch(chatAction.setLookingState(state)),
        setLookingResult: (result, extra) => dispatch(chatAction.setLookingResult(result, extra)),
        setCurrentTab: (tab) => dispatch(tabAction.setActiveTab(tab)),
        setChattingState: (state) => dispatch(chatAction.setChattingState(state)),
        setDisconnectInfo: (info) => dispatch(chatAction.setDisconnectInfo(info))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Control);
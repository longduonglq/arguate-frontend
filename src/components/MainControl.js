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
import {chatStates} from "../store/actions/types";

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

class Control extends React.Component{
    constructor(props) {
        super(props);
    }

    handleStartChatClick = () => {
        //GWebsocket.start_chat();
        this.props.setChatState(chatStates.isLooking);
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
        setCurrentTab: (tab) => dispatch(tabAction.setActiveTab(tab)),
        setChatState: (state) => dispatch(chatAction.setChatState(state)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Control);
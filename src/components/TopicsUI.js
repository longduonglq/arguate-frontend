import React from 'react';

import {withStyles} from "@material-ui/core";
import {red, green} from "@material-ui/core/colors";
import Switch from "@material-ui/core/Switch";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from '@material-ui/icons/Cancel';

import GConfig from "../GConfig";
import * as topicAction from '../store/actions/TopicState';
import {connect} from 'react-redux';
import GWebsocket from "../websocket";

const PurpleSwitch = withStyles(theme => ({
  switchBase: {
      color: red[700],
      '&$checked': {
          color: green[700],
          '& + $track': {
              backgroundColor: green[500],
          },
      },
  },
  checked: {},
  track: {
      backgroundColor: red[500]
  },
}))(Switch);

function capitalize_first(lower) {
    return lower.replace(/^\w/, c => c.toUpperCase());
}

class TopicsUI extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSwitchToggle = name => event => {
        this.props.toggleTopic(name);
        GWebsocket.toggle_opinion(name);
    };

    handleDeleteBtnClick = name => event => {
        this.props.deleteTopic(name);
        GWebsocket.unregister_opinion(name);
    };

    render() {
        return (
            <FormGroup row>{
                this.props.opinions.map((item, i) => {
                    return (
                        <div key={item[0]}
                             style={{
                                 margin: '5px',
                                 marginRight: '0px',
                                 borderRadius: GConfig.TopicUI.borderRadius,
                                 boxShadow: GConfig.TopicUI.boxShadow,
                                 backgroundColor: GConfig.TopicUI.backgroundColor}}>
                            <FormControlLabel
                                control={
                                    <PurpleSwitch checked={item[1]}
                                                  onChange={this.handleSwitchToggle(item[0])}/>
                                }
                                label={capitalize_first(item[0]) + (item[1] ? ' (Support)' : ' (Against)')}
                                style={{marginRight: '0px', marginLeft: '5px'}}
                            />
                            <IconButton style={{padding: '5px'}}
                                        onClick={this.handleDeleteBtnClick(item[0])}>
                                <CancelIcon fontSize='small'/>
                            </IconButton>
                        </div>
                    );
                })
            }</FormGroup>
        );
    }
}

const mapStateToProps = state => {
    return {
        opinions: state.topic.topics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleTopic: (topic) => dispatch(topicAction.toggleTopic(topic)),
        deleteTopic: (topic) => dispatch(topicAction.deleteTopic(topic))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopicsUI);

import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import sendHttp from '../utility';
import debounce from 'lodash.debounce';
import GConfig from "../GConfig";

import * as topic from '../store/actions/TopicState';
import {connect} from 'react-redux';
import GWebsocket from "../websocket";

var cache = {};
setInterval(function () {
    cache = {};
}, 1000*60*GConfig.TopicUI.searchBarMinuteToResetCache);

const loadOptions = (inputValue, callback) => {
    if (inputValue in cache){
        callback(cache[inputValue]);
        return;
    }
    sendHttp('topics', {
        user_id: localStorage.getItem('user_id'),
        input: inputValue
    }).then(res => {
            var raw = JSON.parse(res);
            if (!('topics' in raw) || raw['topics'].length === 0) {
                callback([]);
                cache[inputValue] = [];
                return;
            }

            raw['topics'].sort(function (a, b) {
                return b[1] + b[2] - a[1] - a[2];
            });
            var tamed = [];
            for (let i = 0; i < raw['topics'].length; i++) {
                var people = raw['topics'][i][1] + raw['topics'][i][2];
                tamed.push({
                    value: raw['topics'][i][0],
                    label: `${raw['topics'][i][0]} (${people} people)`
                });
            }
            cache[inputValue] = tamed;
            callback(tamed);
        }
    );
};

const debounceOption = debounce(loadOptions, 300);

class SearchBar extends React.Component{
    constructor(props) {
        super(props);
    }

    handleChange = (newValue) => {
        for (let i = 0; i < this.props.topics.length; i++){
            if (this.props.topics[i][0] === newValue.value) return;
        }
        this.props.addTopic(newValue.value);
        GWebsocket.register_opinion(newValue.value, true);
    };

    render() {
        return (
            <div>
                <AsyncCreatableSelect
                    onChange={this.handleChange}
                    cacheOptions
                    defaultOptions
                    placeholder={'Type in keywords to find topics...'}
                    loadOptions={debounceOption}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        topics: state.topic.topics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addTopic: (newValue) => dispatch(topic.addTopic(newValue))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchBar);
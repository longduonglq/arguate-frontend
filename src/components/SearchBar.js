import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import sendHttp from '../utility';
import debounce from 'lodash.debounce';
import GConfig from "../GConfig";

import * as topic from '../store/actions/TopicState';
import {connect} from 'react-redux';
import GWebsocket from "../websocket";

function isEmptyOrSpaces(str){
    return str === null || str.match(/^\s*$/) !== null;
}

function fires(people){
    var fire = String.fromCodePoint(parseInt('1F525', 16));
    return fire;
}

const loadOptions = (inputValue, callback) => {
    //if (inputValue in cache){
    //    callback(cache[inputValue]);
    //    return;
    //}
    sendHttp('topics', {
        user_id: localStorage.getItem('user_id'),
        input: inputValue
    }).then(
        res => {
            var raw = JSON.parse(res);
            if (!('topics' in raw) || raw['topics'].length === 0) {
                callback([]);
                return;
            }

            if (isEmptyOrSpaces(inputValue)) {
                raw['topics'].sort(function (a, b) {
                    return b[1] + b[2] - a[1] - a[2];
                });
            }
            var tamed = [];
            for (let i = 0; i < raw['topics'].length; i++) {
                var people = raw['topics'][i][1] + raw['topics'][i][2];

                var label = undefined;
                label = GConfig.Global.showNumberOfPeople?
                    `${raw['topics'][i][0]} (${people} people online)`
                    :`${raw['topics'][i][0]} ${fires(people)}`;

                tamed.push({
                    value: raw['topics'][i][0],
                    label: label
                });
            }
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

    handleMenuOpen = () => {
        console.log('menu open');
        console.log(this.refs.async);
        var self = this.refs.async;
        self.mounted=true;
        self.loadOptions('', options => {
            if (!self.mounted) return;
            const isLoading = !!self.lastRequest;
            self.setState({defaultOptions: options  || [], isLoading});
        });
    };

    render() {
        return (
            <div>
                <AsyncCreatableSelect
                    onChange={this.handleChange}
                    cacheOptions={false}
                    defaultOptions
                    placeholder={'Type in keywords to find topics...'}
                    loadOptions={debounceOption}
                    onMenuOpen={this.handleMenuOpen}
                    ref='async'
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
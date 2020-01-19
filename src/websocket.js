import {SOCKET_URL} from "./wsConfig";
import {store} from './index';
import GConfig from "./GConfig";
import * as chatAction from './store/actions/ChatState';
import * as msgAction from './store/actions/MsgState';
import * as tabAction from './store/actions/Tabs';
import {chatStates} from './store/actions/types';
const uuid4 = require('uuid/v4');

var nullFunc = () => {};
class WebsocketService{
    static instance = null;
    static getInstance () {
        if (!WebsocketService.instance) WebsocketService.instance = new WebsocketService();
        return WebsocketService.instance
    }

    callbacks = {
        'register_opinion_err': nullFunc,
        'register_opinion_err.reason': nullFunc,

        'change_opinion_err': nullFunc,
        'user_id_confirmed': nullFunc
    };

    handlers = {
        'start_chat_success': this.start_chat_success.bind(this),
        'start_chat_err.no_opponents': this.no_opponents.bind(this),
        'start_chat_err.could_not_start': this.could_not_start.bind(this),

        'receive_end_chat': this.receive_end_chat.bind(this),

        'receive_typing_status': this.receive_typing_status.bind(this),

        'receive_msg_from': this.receive_msg_from.bind(this),
    };

    constructor() {
        this.socketRef = null;

        this.start_chat_timeouts = [];
        this.start_chat_attempts = 1;
    }

    connect() {
        const path = `${SOCKET_URL}/wss/chat/`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log('websocket open');
            if ('user_id' in localStorage){
                this.sendJSON({
                    cmd: 'user_id',
                    id: localStorage.getItem('user_id')
                });
            }else{
                let _id = uuid4();
                localStorage.setItem('user_id', _id);
                this.sendJSON({
                    cmd: 'user_id',
                    id: _id
                });
            }
        };
        this.socketRef.onmessage = e => {
            this.socketNewMsg(e.data);
        };
        this.socketRef.onerror = e => {
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log("websocket closed, reopening");
            this.connect();
        };
        this.wait_for_connection();
    }
    
    wait_for_connection(){
        setTimeout(
            () => {
                if (this.socketRef.readyState === 1){
                    console.log('connection is made');
                } else {
                    console.log('wait for connection...');
                    this.wait_for_connection();
                }
            }, 50
        );
    }
    
    sendJSON(data) {
        try {
            this.socketRef.send(JSON.stringify({...data}));
            console.log('data send: ', data);
        } catch (err) {
            console.log(err.message, data);
        }
    }

    addCallback(event, callback){
        this.callbacks[event] = callback;
    }

    socketNewMsg(data) {
        const parsedData = JSON.parse(data);
        const cmd = parsedData.cmd;
        console.debug('data received: ', parsedData);
        if (cmd in this.handlers) {
            this.handlers[cmd](parsedData);
        }
        else if (cmd in this.callbacks) {
            this.callbacks[cmd](parsedData);
        }
    }

    start_chat(){
        for (let i = 0; i < this.start_chat_timeouts.length; i++){
            clearTimeout(this.start_chat_timeouts[i]);
        }
        this.start_chat_timeouts = [];
        this.start_chat_attempts = 1;

        this.sendJSON({
            cmd: 'start_chat'
        });
    }

    stop_start_chat( ) {
       for (let i = 0; i < this.start_chat_timeouts.length; i++){
            clearTimeout(this.start_chat_timeouts[i]);
       }
       this.start_chat_timeouts = [];
       this.start_chat_attempts = 1;
    }

    start_chat_success(data){
        for (let i = 0; i < this.start_chat_timeouts.length; i++){
            clearTimeout(this.start_chat_timeouts[i]);
        }
        this.start_chat_timeouts = [];
        this.start_chat_attempts = 1;

        store.dispatch(chatAction.setChatState(
            chatStates.lookingSuccess,
            {topic: data['topic'], opinion: data['opinion']}
        ));
        store.dispatch(tabAction.setActiveTab(1));
    }

    no_opponents(data) {
        var arr = GConfig.ws.chatFindingAttempts;
        if (this.start_chat_attempts < arr.length){
            this.start_chat_timeouts.push(
                setTimeout(() => {
                    this.sendJSON({
                        cmd: 'start_chat'
                    });
                    this.start_chat_attempts += 1;
                }, arr[this.start_chat_attempts] * 1000)
            );
        } else {
            store.dispatch(chatAction.setChatState(
                chatStates.lookingFailed_NOP
            ));
            store.dispatch(tabAction.setActiveTab(1));
        }
    }

    could_not_start(data) {
        store.dispatch(chatAction.setChatState(
            chatStates.lookingFailed_SER
        ));
        store.dispatch(tabAction.setActiveTab(1));
    }

    end_chat(data) {
        this.sendJSON({cmd: 'end_chat'});
    }
    receive_end_chat(data) {
        store.dispatch(chatAction.setChatState(
            chatStates.otherDisconnect
        ));
        store.dispatch(msgAction.setTypingState(false));
        store.dispatch(tabAction.setActiveTab(1));
    }
    receive_typing_status(data) {
        store.dispatch(msgAction.setTypingState(data['isTyping']));
    }
    receive_msg_from(data) {
        store.dispatch(tabAction.setActiveTab(1));
        store.dispatch(msgAction.newMsg(1, data['msg']));
    }

    send_msg_to(msg) {
        this.sendJSON({
            cmd: 'send_msg_to',
            msg: msg
        }); 
    }
    
    register_opinion(topic, position) {
        this.sendJSON({
            cmd: 'register_opinion',
            topic: topic,
            position: position
        });
    }
    toggle_opinion(topic) {
        this.sendJSON({
            cmd: 'change_opinion',
            topic: topic
        });
    }
    unregister_opinion(topic) {
        this.sendJSON({
            cmd: 'unregister_opinion',
            topic: topic
        });
    }
    
    send_feedback(email, feedback){
        this.sendJSON({
            cmd: 'send_feedback',
            email: email,
            feedback: feedback
        });
    }
    
    send_typing_status(status){
        this.sendJSON({
            cmd: 'typing_status',
            isTyping: status
        });
    }
}

const GWebsocket = WebsocketService.getInstance();
export default GWebsocket;
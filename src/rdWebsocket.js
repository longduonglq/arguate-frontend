import GWebsocket from "./websocket";
import {store} from './index';
import {chatStates} from './store/actions/types';
import * as msgAction from "./store/actions/MsgState";
import * as chatAction from './store/actions/ChatState';

class rdWebsocket {
    constructor() {
        this.listener = this.listener.bind(this);
        store.subscribe(this.listener);
        this.prevState = store.getState();
    }

    listener(){
        var curState = store.getState();
        if (curState.chat.state !== this.prevState.chat.state){
            switch(curState.chat.state){
                case chatStates.isLooking:
                    console.log('rdws is looking');
                    GWebsocket.start_chat();
                    break;
                case chatStates.userDisconnect:
                    GWebsocket.end_chat(); 
                    break;
                case chatStates.lookingFailed_USR:
                    console.log('looking user disconnect');
                    GWebsocket.end_chat();
                    GWebsocket.stop_start_chat();
                    break;
                case chatStates.lookingFailed_SER:
                    GWebsocket.end_chat();
                    break;
                case chatStates.lookingFailed_NOP:
                    GWebsocket.end_chat();
                default:
                    console.log('default case in rdWebsocket listener');
            }
            this.prevState.chat.state = curState.chat.state;
        }
    }
}

export default rdWebsocket;


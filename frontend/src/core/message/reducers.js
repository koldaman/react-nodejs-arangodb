import { SHOW_MESSAGE, HIDE_ALL_MESSAGES } from "./actions";
import { MESSAGE_ERROR, MESSAGE_INFO, MESSAGE_LOAD, MESSAGE_SUCCESS, MESSAGE_WARN } from "./constants";
import { message } from 'antd';


const messageReducer = (state = {messages:[]}, action) => {
	const defaultTimeout = 5;
	switch (action.type) {
		case SHOW_MESSAGE:
			let cb;
			if (action.payload.clearOthers) {
				clearAllMessages(state);
			}
			switch(action.payload.type) {
				case MESSAGE_SUCCESS: cb = message.success(action.payload.text, action.payload.duration || defaultTimeout); break;
				case MESSAGE_INFO:    cb = message.info(action.payload.text, action.payload.duration || defaultTimeout); break;
				case MESSAGE_WARN:    cb = message.warn(action.payload.text, action.payload.duration || defaultTimeout); break;
				case MESSAGE_ERROR:   cb = message.error(action.payload.text, action.payload.duration || defaultTimeout); break;
				case MESSAGE_LOAD:    cb = message.loading(action.payload.text, action.payload.duration || defaultTimeout); break;
				default:              cb = message.info(action.payload.text, action.payload.duration || defaultTimeout);
			}
			return Object.assign({}, state, {
				messages: state.messages.concat(cb)
			});
		case HIDE_ALL_MESSAGES:
			clearAllMessages(state);
			return Object.assign({}, state, {
				messages: []
			});
		default:
			return state;
	}
};

const clearAllMessages = (state) => {
	state.messages.forEach((item, index) => {
		item();
	});
};

export default messageReducer;
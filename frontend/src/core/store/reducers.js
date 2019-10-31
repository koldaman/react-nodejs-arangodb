import loginReducer from "../../auth/reducers";
import messageReducer from "../../core/message/reducers";
import {combineReducers} from 'redux';

const allReducers = combineReducers({
	login: loginReducer,
	message: messageReducer
});

export default allReducers;
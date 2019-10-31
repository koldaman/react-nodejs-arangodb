export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_ALL_MESSAGES = "HIDE_ALL_MESSAGES";

export const showMessage = (message) => {
	return {
		type: SHOW_MESSAGE,
		payload: message
	}
};

export const hideMessages = (message) => {
	return {
		type: HIDE_ALL_MESSAGES
	}
};


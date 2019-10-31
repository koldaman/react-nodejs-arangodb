export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const login = (user) => {
	return {
		type: SIGN_IN,
		payload: user
	}
};

export const logout = () => {
	return {
		type: SIGN_OUT
	}
};

export const refresh = () => {
	return {
		type: null // default
	}
};
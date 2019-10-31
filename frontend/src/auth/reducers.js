import { SIGN_IN, SIGN_OUT } from "./actions";
import auth from "./auth";


const loginReducer = (state = {logged: false, user: null}, action) => {
	switch (action.type) {
		case SIGN_IN:
			console.log('signing in', action.payload);
			auth.setUser(action.payload);
			return Object.assign({}, state, {
				logged: !!action.payload.token,
				user: action.payload
			});
		case SIGN_OUT:
			console.log('signing out', state.user);
			if (state.user && state.user.source === 'google') {
				window.gapi.load('auth2', () => {
					const auth2 = window.gapi.auth2.getAuthInstance();
					auth2 && auth2.signOut().then(function () {
						console.log('signed out');

					});
					auth2 && auth2.disconnect();
				});
			}
			auth.clearUser();
			return Object.assign({}, state, {
				logged: false,
				user: null
			});
		default:
			return Object.assign({}, state, {
				logged: auth.isAuthenticated(),
				user: auth.getUser()
			});
	}
};

export default loginReducer;
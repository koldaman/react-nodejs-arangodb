
class Auth {
	setUser(user) {
		localStorage.setItem("jwt", user.token);
		localStorage.setItem("user", JSON.stringify({name: user.name, email: user.email, id: user.id, imageUrl: user.imageUrl, source: user.source}));
	}

	clearUser() {
		localStorage.removeItem("jwt");
		localStorage.removeItem("user");
	}

	getToken() {
		return localStorage.getItem("jwt");
	}

	getUser() {
		let user = localStorage.getItem("user");
		return !!user ? JSON.parse(user) : null;
	}

	isAuthenticated() {
		return this.getToken() != null;
	}
}


export default new Auth();
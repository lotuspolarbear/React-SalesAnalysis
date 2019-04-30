import * as types from "../constants";

export function Admin() {
	localStorage.setItem("isAdmin", true);
	localStorage.setItem("isUser", true);
	return {
		type: types.ISADMIN,
		payload: {
			isAdmin: true,
			isUser: true
		}
	};
}

export function Loggedin() {
	localStorage.setItem("isAdmin", false);
	localStorage.setItem("isUser", true);
	return {
		type: types.ISUSER,
		payload: {
			isAdmin: false,
			isUser: true
		}
	};
}

export function Loggedout() {
	localStorage.setItem("isUser", false);
	localStorage.setItem("isAdmin", false);
	return {
		type: types.ISLOGGEDOUT,
		payload: {
			isAdmin: false,
			isUser: false
		}
	};
}

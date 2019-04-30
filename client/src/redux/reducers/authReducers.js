import * as types from "../constants";

const initialState = {
	isUser: JSON.parse(localStorage.getItem("isUser")),
	isAdmin: JSON.parse(localStorage.getItem("isAdmin"))
};

export default function reducer(state = initialState, actions) {
	const { payload, type } = actions;
	switch (type) {
		case types.ISUSER:
			return {
				...state,
				...payload
			};
		case types.ISADMIN:
			return {
				...state,
				...payload
			};
		case types.ISLOGGEDOUT:
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}

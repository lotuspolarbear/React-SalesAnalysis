import * as types from "../constants";

const initialState = {
	selectedUserId: "",
	selectedUserName: ""
};

export default function reducer(state = initialState, actions) {
	const { payload, type } = actions;
	switch (type) {
		case types.USER_SELECTED:
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}

import * as types from "../constants";

export function userSelectedState(selectedUserId, selectedUserName) {
	return {
		type: types.USER_SELECTED,
		payload: { selectedUserId: selectedUserId, selectedUserName: selectedUserName }
	};
}

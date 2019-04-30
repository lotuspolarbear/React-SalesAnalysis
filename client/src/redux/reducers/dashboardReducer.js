import * as types from "../constants";

const initialState = {
	file_uploaded: false
};

export default function reducer(state = initialState, actions) {
	const { payload, type } = actions;
	switch (type) {
		case types.FILE_UPLOADED:
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}

import * as types from "../constants";

export function fileUploadState(flag) {
	return {
		type: types.FILE_UPLOADED,
		payload: { file_uploaded: flag }
	};
}

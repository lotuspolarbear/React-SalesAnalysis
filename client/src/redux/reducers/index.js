import { combineReducers } from "redux";

import auth from "./authReducers";
import sidebar from "./sidebarReducers";
import layout from "./layoutReducer";
import theme from "./themeReducer";
import dashboard from "./dashboardReducer";
import admin from "./adminReducers";

import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
	sidebar,
	layout,
	theme,
	toastr,
	dashboard,
	admin,
	auth
});

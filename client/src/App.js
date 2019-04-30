import React from "react";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./redux/store/index";
import Routes from "./routes/Routes";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const App = () => (
	<Provider store={store}>
		<NotificationContainer />
		<Routes />
		<ReduxToastr
			timeOut={5000}
			newestOnTop={true}
			position='top-right'
			transitionIn='fadeIn'
			transitionOut='fadeOut'
			progressBar
			closeOnToastrClick
		/>
	</Provider>
);

export default App;

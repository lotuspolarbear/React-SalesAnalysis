// Importing packages
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
// Importing components
import AppNavbar from "./components/AppNavBar";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import Signout from "./components/user/Signout";
// Importing packages' styles
import "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-notifications/lib/notifications.css";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedin: false,
			isAdmin: false
		};
	}

	componentDidMount() {
		if (localStorage.getItem("token")) {
			this.setState({ isLoggedin: true });
		}
	}

	checkAdmin = (flag) => {
		this.setState({isAdmin : flag});
	}

	checkLogin = (flag) => {
		this.setState({isLoggedin : flag});
	}

	render() {
		return (
			<Router>
				<div className='App'>
					<NotificationContainer />
					<AppNavbar isLoggedin = {this.state.isLoggedin} isAdmin = {this.state.isAdmin}/>

					{this.state.isLoggedin && (
						<React.Fragment>
							<Route exact path = '/signout' render={() => <Signout checkLogin = {this.checkLogin} checkAdmin = {this.checkAdmin} />} />
						</React.Fragment>
					)}

					{!this.state.isLoggedin && (
						<React.Fragment>
							<Route exact path = '/' render = {() => <Signin checkLogin = {this.checkLogin} checkAdmin = {this.checkAdmin} />} />
							<Route path = '/signup' component = {Signup}/>
							<Route path = '/signin' component = {Signin}/>
						</React.Fragment>
					)}
				</div>
			</Router>
		);
	}
}

export default App;

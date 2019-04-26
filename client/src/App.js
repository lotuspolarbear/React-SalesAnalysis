// Importing packages
import React, { Component } from "react";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
// Importing components
import AppNavBar from "./components/AppNavBar";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import Signout from "./components/user/Signout";
import AdminDashboard from "./components/admin/Dashboard";
import UserDashboard from "./components/user/Dashboard";
// Importing packages' styles
import "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-notifications/lib/notifications.css";
import "./App.css";
import { createBrowserHistory as history } from 'history';

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
		if (localStorage.getItem("admin")) {
			this.setState({ isAdmin: true });
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
			<Router history={history}>
				<div className='App'>
					<NotificationContainer />
					<AppNavBar isLoggedin = {this.state.isLoggedin} isAdmin = {this.state.isAdmin}/>

					{this.state.isLoggedin && (
						<React.Fragment>
							<Route exact path = '/signout' render={() => <Signout checkLogin = {this.checkLogin} checkAdmin = {this.checkAdmin} />} />
						</React.Fragment>
					)}
					{this.state.isLoggedin && this.state.isAdmin &&(
						<React.Fragment>
							<Route exact path = '/admin/dashboard' component = {AdminDashboard} />
						</React.Fragment>
					)}
					{this.state.isLoggedin && !this.state.isAdmin &&(
						<React.Fragment>
							<Route exact path = '/user/dashboard' component = {UserDashboard} />
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

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { dashboard as dashboardRoutes } from "./index";
import AdminDashboard from "../pages/admin";
import DashboardLayout from "../layouts/Dashboard";
import ScrollToTop from "../components/ScrollToTop";
import AuthLayout from "../layouts/Auth"; // layout for signin and signup
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import SignNavbar from "../components/SignNavbar";

import { connect } from "react-redux";
import { Loggedout } from "../redux/actions/authAction";

let globalMount = true;
const ChildRoutes = ({ layout: Layout, routes }) =>
	globalMount && (
		<Layout>
			{routes.map((category, index) =>
				category.children ? (
					// Route item with children
					category.children.map((route, index) => {
						return <Route key={index} path={route.path} exact component={route.component} />;
					})
				) : (
					// Route item without children
					<Route key={index} path={category.path} exact component={category.component} />
				)
			)}
		</Layout>
	);

class Routes extends Component {
	componentDidMount() {
		globalMount = true; // for preventing changes of state when component unmounted
	}
	componentWillUnmount() {
		globalMount = false;
	}
	render() {
		const { isUser, isAdmin } = this.props;
		return (
			<Router>
				<ScrollToTop>
					<Switch>
						<Route
							path='/'
							exact
							component={() => {
								return isUser ? (
									isAdmin ? (
										<Redirect to='/admin/dashboard' />
									) : (
										<Redirect to='/dashboard/default' />
									)
								) : (
									<Redirect to='/sign-in' />
								);
							}}
						/>
						<Route
							path='/sign-in'
							exact
							component={() => (
								<React.Fragment>
									<SignNavbar />
									<AuthLayout>
										<SignIn />
									</AuthLayout>
								</React.Fragment>
							)}
						/>
						<Route
							path='/sign-up'
							exact
							component={() => (
								<React.Fragment>
									<SignNavbar />
									<AuthLayout>
										<SignUp />
									</AuthLayout>
								</React.Fragment>
							)}
						/>
						{isAdmin && <Route path='/admin/dashboard' exact component={AdminDashboard} />}
						{!isAdmin && isUser && (
							<Route
								path='/dashboard/default'
								exact
								component={() => <ChildRoutes layout={DashboardLayout} routes={dashboardRoutes} />}
							/>
						)}

						{isAdmin && <Redirect to='/admin/dashboard' />}
						{!isAdmin && isUser && <Redirect to='/dashboard/default' />}
						{!isUser && <Redirect to='/sign-in' />}
					</Switch>
				</ScrollToTop>
			</Router>
		);
	}
}

const mapStateToProps = state => {
	return {
		isUser: state.auth.isUser,
		isAdmin: state.auth.isAdmin
	};
};

const mapDispatchToProps = dispatch => {
	return {
		Loggedout: () => dispatch(Loggedout(true))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Routes);

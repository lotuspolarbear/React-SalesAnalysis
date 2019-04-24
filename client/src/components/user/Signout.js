import React, { Component } from "react";
import { Redirect } from "react-router";

class Signout extends Component {
	constructor(props) {
		super(props);
		localStorage.clear();
	}
	componentDidMount() {
		this.props.checkLogin(false);
		this.props.checkAdmin(false);
	}

	render() {
		return <Redirect to='/' />;
	}
}
export default Signout;
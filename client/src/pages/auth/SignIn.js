import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { Button, Card, CardBody, Form, FormGroup, Input, CustomInput } from "reactstrap";

import avatar from "../../assets/img/avatars/avatar.jpg";
import { connect } from "react-redux";
import { Loggedin, Admin } from "../../redux/actions/authAction";
import axios from "axios";
import { NotificationManager } from "react-notifications";

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			isMount: false,
			isUser: JSON.parse(localStorage.getItem("isUser")),
			isAdmin: JSON.parse(localStorage.getItem("isAdmin"))
		};
	}
	onChange = e => {
		this.state.isMount && this.setState({ [e.target.name]: e.target.value });
	};
	componentDidMount() {
		this.setState({ isMount: true });
	}
	componentWillUnmount() {
		this.setState({ isMount: false });
	}
	handleLoggedin = async () => {
		const { Loggedin, Admin } = this.props;
		const { isMount } = this.state;
		await axios
			.post("/users/login", {
				email: this.state.email,
				password: this.state.password
			})
			.then(async res => {
				if (res.data.success) {
					localStorage.setItem("token", res.data.token);

					if (res.data.userType === true) {
						isMount && this.setState({ isUser: true, isAdmin: true });
						Admin();
					} else {
						isMount && this.setState({ isUser: true, isAdmin: false });
						Loggedin();
					}
					NotificationManager.success(res.data.message, res.data.title, 3000);
				} else {
					NotificationManager.error(res.data.errors[0].message, res.data.errors[0].title, 3000);
				}
			});
	};
	render() {
		const { isUser, isAdmin } = this.state;
		if (isAdmin) {
			return <Redirect to='/admin/dashboard' />;
		} else if (isUser) {
			return <Redirect to='/dashboard/default' />;
		} else {
			return (
				<React.Fragment>
					<div className='text-center' style={{ marginTop: -100 }}>
						<h1>Sign in</h1>
					</div>

					<Card>
						<CardBody>
							<div className='m-sm-4'>
								<div className='text-center'>
									<img
										src={avatar}
										alt='Chris Wood'
										className='img-fluid rounded-circle'
										width='132'
										height='132'
									/>
								</div>
								<Form style={{ marginTop: 30 }}>
									<FormGroup>
										{/* <Label>Email</Label> */}
										<Input
											bsSize='lg'
											type='email'
											name='email'
											placeholder='Enter your email'
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										{/* <Label>Password</Label> */}
										<Input
											bsSize='lg'
											type='password'
											name='password'
											placeholder='Enter your password'
											onChange={this.onChange}
										/>
										<small hidden>
											<Link to='/auth/reset-password'>Forgot password?</Link>
										</small>
									</FormGroup>
									<div hidden>
										<CustomInput
											type='checkbox'
											id='rememberMe'
											label='Remember me next time'
											defaultChecked
										/>
									</div>
									<div className='text-center mt-3'>
										<Button color='primary' size='lg' onClick={() => this.handleLoggedin()}>
											Sign in
										</Button>
									</div>
								</Form>
							</div>
						</CardBody>
					</Card>
				</React.Fragment>
			);
		}
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
		Loggedin: () => dispatch(Loggedin()),
		Admin: () => dispatch(Admin())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignIn);

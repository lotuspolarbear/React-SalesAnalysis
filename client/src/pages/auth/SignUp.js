import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Card, CardBody, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { connect } from "react-redux";
import { Loggedin } from "../../redux/actions/authAction";

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			companyName: "",
			phoneNumber: "",
			role: "",
			password: "",
			cpassword: "",
			isRegistered: false
		};
	}
	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	handleSignup = () => {
		const { firstName, lastName, email, companyName, phoneNumber, role, password, cpassword } = this.state;
		if (
			firstName === "" ||
			lastName === "" ||
			email === "" ||
			companyName === "" ||
			phoneNumber === "" ||
			role === "" ||
			password === ""
		) {
			NotificationManager.error("Every field should be filled.", "Error!", 5000);
		} else if (password !== cpassword) {
			NotificationManager.error("Password should be confirmed.", "Error!", 5000);
		} else {
			axios
				.post("/users/register", {
					firstName: firstName,
					lastName: lastName,
					email: email,
					companyName: companyName,
					phoneNumber: phoneNumber,
					role: role,
					password: password
				})
				.then(res => {
					if (res.data.success) {
						NotificationManager.success(res.data.msg, "Notification!", 5000);
						// localStorage.setItem("isUser", true);
						// this.props.Loggedin();
						this.setState({ isRegistered: true });
					} else {
						NotificationManager.error(res.data.msg, "Error!", 5000);
					}
				})
				.catch(function(error) {
					console.log(error);
					if (error.response.status === 403) {
						// th.props.history.push("/signout");
					}
				});
		}
	};
	render() {
		const { isRegistered } = this.state;
		const { isUser } = this.props;
		if (isRegistered) {
			return <Redirect to='/sign-in' />;
		} else {
			return (
				<React.Fragment>
					{isUser && <Redirect to='/dashboard/default' />}
					<div className='text-center mt-4'>
						<h1 className='h2'>Sign up</h1>
					</div>

					<Card>
						<CardBody>
							<div className='m-sm-4'>
								<Form>
									<FormGroup>
										<Label>First Name</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='text'
											name='firstName'
											placeholder='Enter your first name'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Last Name</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='text'
											name='lastName'
											placeholder='Enter your last name'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Email</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='email'
											name='email'
											placeholder='Enter your email'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Company Name</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='text'
											name='companyName'
											placeholder='Enter your company name'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Phone Number</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='number'
											name='phoneNumber'
											placeholder='Enter your Phone Number'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Role</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='text'
											name='role'
											placeholder='Enter your Role'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Password</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='password'
											name='password'
											placeholder='Enter password'
										/>
									</FormGroup>
									<FormGroup>
										<Label>Confirm Password</Label>
										<Input
											onChange={this.onChange}
											bsSize='lg'
											type='password'
											name='cpassword'
											placeholder='Re-enter password'
										/>
									</FormGroup>
									<div className='text-center mt-3'>
										<Button
											color='primary'
											size='lg'
											onClick={() => {
												this.handleSignup();
											}}
										>
											Sign up
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
		Loggedin: () => dispatch(Loggedin(true))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp);

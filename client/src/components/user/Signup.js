import React, { Component } from "react";
import { Redirect } from "react-router";
import { Input, Label } from "reactstrap";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { ValidatorForm } from "react-form-validator-core";
import TextValidator from "../TextValidator";

class Signup extends Component {
	constructor() {
		super();
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

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		const th = this;
		e.preventDefault();
		if (this.state.password !== this.state.cpassword) {
			NotificationManager.error("Password should be confirmed.", "Error!", 5000);
		} else {			
			axios
				.post("/users/register", {
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					email: this.state.email,
					companyName: this.state.companyName,
					phoneNumber: this.state.phoneNumber,
					role: this.state.role,
					password: this.state.password
				})
				.then(res => {
					if (res.data.success) {
						NotificationManager.success(res.data.msg, "Notification!", 5000);
						this.setState({ isRegistered: true });
					} else {
						NotificationManager.error(res.data.msg, "Error!", 5000);
					}
				})
				.catch(function (error) {
					if (error.response.status === 403) {
						th.props.history.push('/signout')
					}
				});;
		}
	}

	render() {
		const { isRegistered } = this.state;
		
		return (
			<React.Fragment>
				{isRegistered && <Redirect to='/signin' />}
				{!isRegistered && (
					<React.Fragment>
						<div className='container'>
							<div className='row'>
								<div className='col-md-6 mt-100 mx-auto'>
									<ValidatorForm ref='form' onSubmit={this.onSubmit}>
										<h3 className='h3 mb-5 font-weight-normal text-center'>
											Sign Up
										</h3>
										<div className='form-group row'>
											<label htmlFor='FirstName' className='col-sm-4 col-form-label'>
												First Name:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='firstName'
													className='form-control'
													value={this.state.firstName}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='LastName' className='col-sm-4 col-form-label'>
												Last Name:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='lastName'
													className='form-control'
													value={this.state.lastName}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='Email' className='col-sm-4 col-form-label'>
												Email:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='email'
													className='form-control'
													value={this.state.email}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='CompanyName' className='col-sm-4 col-form-label'>
												Company Name:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='companyName'
													className='form-control'
													value={this.state.companyName}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='PhoneNumber' className='col-sm-4 col-form-label'>
												Phone Number:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='phoneNumber'
													className='form-control'
													value={this.state.phoneNumber}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='Role' className='col-sm-4 col-form-label'>
												Role:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='role'
													className='form-control'
													value={this.state.role}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='password' className='col-sm-4 col-form-label'>
												Password:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='password'
													type='password'
													className='form-control'
													value={this.state.password}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<label htmlFor='cpassword' className='col-sm-4 col-form-label'>
												Confirm Password:
											</label>
											<div className='col-sm-8'>
												<TextValidator
													onChange={this.onChange}
													name='cpassword'
													type='password'
													className='form-control'
													value={this.state.cpassword}
													validators={["required"]}
													errorMessages={["This field is required"]}
												/>
											</div>
										</div>
										<div className='form-group row'>
											<div className='col-sm-8 offset-sm-4'>
												<button type='submit' className='btn btn-lg btn-info btn-block'>
													Sign Up
												</button>
											</div>
										</div>
									</ValidatorForm>
								</div>
							</div>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
		
	}
}

export default Signup;

import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	Container
} from "reactstrap";

class AppNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		};
	}
	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		return (
			<div>
				<Navbar color='dark' dark expand='sm' className='mb-5'>
					<Container>
						<Link className='navbar-brand' to='/'>CSV Analysis</Link>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className='ml-auto' navbar>
								{this.props.isLoggedin && (
									<React.Fragment>										
										<NavItem>
											<Link className='nav-link' to='/dashboard'>Dashboard</Link>
										</NavItem>
										
										<NavItem>
											<Link className='nav-link' to='/signout'>Sign Out</Link>
										</NavItem>
									</React.Fragment>
								)}
								{!this.props.isLoggedin && (
									<React.Fragment>										
										<NavItem>
											<Link className='nav-link' to='/signup'>Sing Up</Link>
										</NavItem>
										
										<NavItem>
											<Link className='nav-link' to='/signin'>Sign In</Link>
										</NavItem>
									</React.Fragment>
								)}
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

export default AppNavbar;

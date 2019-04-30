import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Collapse, Navbar, Nav } from "reactstrap";

class NavbarComponent extends Component {
	render() {
		return (
			<React.Fragment>
				<Navbar color='white' light expand>
					<Collapse navbar>
						<Nav className='ml-auto' navbar>
							<Link to='/sign-in'>Sign in</Link>
							&nbsp;&nbsp;&nbsp;
							<Link to='/sign-up'>Sign up</Link>
						</Nav>
					</Collapse>
				</Navbar>
			</React.Fragment>
		);
	}
}

export default NavbarComponent;

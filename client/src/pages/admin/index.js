import React, { Component } from "react";
import UserList from "./UserList";
// import FileList from "./FileList";
import DashboardLayout from "../../layouts/Dashboard";

class Dashboard extends Component {
	render() {
		return (
			<DashboardLayout>
				<div className='container'>
					<div className='row'>
						<div className='col-md-12'>
							<UserList />
						</div>
						{/* <div className='col-md-5'>
							<FileList />
						</div> */}
					</div>
				</div>
			</DashboardLayout>
		);
	}
}

export default Dashboard;

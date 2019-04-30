import React, { Component } from "react";
import { Card, CardBody, Container } from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { MinusCircle, PlusCircle } from "react-feather";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { userSelectedState } from "../../redux/actions/adminAction";
import FileList from "./FileList";

const tableColumns = [
	{
		dataField: "name",
		text: "Name",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#a180da", color: "white" };
		}
	},
	{
		dataField: "email",
		text: "Email",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#a180da", color: "white" };
		}
	},
	{
		dataField: "companyName",
		text: "Company Name",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#a180da", color: "white" };
		}
	},
	{
		dataField: "phoneNumber",
		text: "Phone Number",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#a180da", color: "white" };
		}
	},
	{
		dataField: "role",
		text: "Role",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#a180da", color: "white" };
		}
	}
];

class ExpandableRowsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false
		};
	}
	handleOnSelect = (row, isSelect) => {
		if (isSelect) {
			this.props.userSelectedState(row.id, row.name);
		}
		return true; // return true or dont return to approve current select action
	};
	handleOnExpand = (row, isExpand, rowIndex, e) => {
		// if (isExpand) {
		// 	this.setState({ isExpanded: true });
		// } else {
		// 	this.setState({ isExpanded: false });
		// }
		// this.props.userSelectedState(row.id, row.name);
	};
	render() {
		const { tableData } = this.props;

		// const selectRow = {
		// 	mode: "radio",
		// 	clickToSelect: true,
		// 	clickToExpand: true,
		// 	onSelect: this.handleOnSelect,
		// 	hideSelectColumn: true,
		// 	style: { backgroundColor: "#a180da", color: "white", cursor: "pointer" }
		// };

		const rowStyle = {
			cursor: "pointer",
			backgroundColor: "#eee"
			// color: "white"
		};

		const expandRow = {
			// showExpandColumn: true,
			renderer: row => <FileList selectedUserId={row.id} selectedUserName={row.name} />,
			onExpand: this.handleOnExpand,
			onlyOneExpanding: true,
			showExpandColumn: false,
			expandHeaderColumnRenderer: ({ isAnyExpands }) =>
				isAnyExpands ? <MinusCircle width={16} height={16} /> : <PlusCircle width={16} height={16} />,
			expandColumnRenderer: ({ expanded }) =>
				expanded ? <MinusCircle width={16} height={16} /> : <PlusCircle width={16} height={16} />
		};

		return (
			<Card>
				<CardBody>
					<BootstrapTable
						bootstrap4
						bordered={false}
						keyField='id'
						data={tableData}
						columns={tableColumns}
						expandRow={expandRow}
						// selectRow={selectRow}
						pagination={paginationFactory({
							sizePerPage: 10,
							sizePerPageList: [5, 10, 25, 50]
						})}
						rowStyle={rowStyle}
						striped
						hover
					/>
				</CardBody>
			</Card>
		);
	}
}

class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userList: [],
			tableData: []
		};
	}

	componentDidMount() {
		const token = localStorage.token;
		axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		this.getUserList();
	}

	async getUserList() {
		await axios
			.get("/users/getAllUsers")
			.then(res => {
				// return;
				if (res.data.success) {
					let userList = [];
					for (let row of res.data.users) {
						userList = [
							...userList,
							{
								id: row._id,
								name: `${row.firstName}${" "}${row.lastName}`,
								email: row.email,
								companyName: row.companyName,
								phoneNumber: row.phoneNumber,
								role: row.role
							}
						];
					}
					this.setState({ tableData: userList });
				} else {
					NotificationManager.error(res.data.msg, "Error!", 3000);
				}
			})
			.catch(function(error) {
				console.log(error);
				if (error.response.status === 403) {
					// console.log(th.props);
					// th.props.history.push('/signout');
				}
			});
	}
	render() {
		const { tableData } = this.state;
		const { userSelectedState, selectedUserId } = this.props;
		return (
			<Container fluid className='p-0'>
				<h1 className='mt-1'>User List</h1>
				<ExpandableRowsTable
					selectedUserId={selectedUserId}
					tableData={tableData}
					userSelectedState={userSelectedState}
				/>
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedUserId: state.admin.selectedUserId,
		selectedUserName: state.admin.selectedUserName
	};
};

const mapDispatchToProps = dispatch => {
	return {
		userSelectedState: (selectedUserId, selectedUserName) =>
			dispatch(userSelectedState(selectedUserId, selectedUserName))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserList);

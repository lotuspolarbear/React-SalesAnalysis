import React, { Component } from "react";
import { Card, CardBody, Container } from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// import { MinusCircle, PlusCircle } from "react-feather";
// import jwt_decode from "jwt-decode";
import axios from "axios";
import { NotificationManager } from "react-notifications";
// import { connect } from "react-redux";
// import { userSelectedState } from "../../redux/actions/adminAction";

const tableColumns = [
	{
		dataField: "fileName",
		text: "File Name",
		sort: true,
		headerStyle: () => {
			return { width: "60%", backgroundColor: "#47BAC1", color: "white" };
		}
	},
	{
		dataField: "link",
		text: "Study link",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#47BAC1", color: "white" };
		}
	},
	{
		dataField: "uploadDate",
		text: "Uploaded Date",
		sort: true,
		headerStyle: () => {
			return { width: "20%", backgroundColor: "#47BAC1", color: "white" };
		}
	}
];

const ExpandableRowsTable = ({ tableData }) => {
	// const expandRow = {
	// 	renderer: row => (
	// 		<div>
	// 			<p>{`This Expand row is belong to "${row.fileName}"`}</p>
	// 			<p>You can render anything here, also you can add additional data on every row object.</p>
	// 		</div>
	// 	),
	// 	showExpandColumn: true,
	// 	expandHeaderColumnRenderer: ({ isAnyExpands }) =>
	// 		isAnyExpands ? <MinusCircle width={16} height={16} /> : <PlusCircle width={16} height={16} />,
	// 	expandColumnRenderer: ({ expanded }) =>
	// 		expanded ? <MinusCircle width={16} height={16} /> : <PlusCircle width={16} height={16} />
	// };

	return (
		<Card>
			<CardBody>
				<BootstrapTable
					bootstrap4
					bordered={true}
					keyField='id'
					data={tableData}
					columns={tableColumns}
					// expandRow={expandRow}
					pagination={paginationFactory({
						sizePerPage: 5,
						sizePerPageList: [5, 10, 25, 50]
					})}
				/>
			</CardBody>
		</Card>
	);
};

class FileList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: "",
			fileList: [],
			tableData: [],
			selectedUserId: "",
			selectedUserName: "",
			isMount: false
		};
	}

	componentDidMount() {
		this.setState({ isMount: true });
		const token = localStorage.token;
		axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		this.setState({ selectedUserName: this.props.selectedUserName });
		this.setState({ selectedUserId: this.props.selectedUserId }, () => this.getFileList());

		// this.getFileList();
	}

	componentWillUnmount() {
		this.setState({ isMount: false });
	}

	// componentWillReceiveProps(nextProps) {

	// 	this.setState({ selectedUserName: nextProps.selectedUserName });
	// 	this.setState({ selectedUserId: nextProps.selectedUserId }, () => this.getFileList());
	// }

	async getFileList() {
		const { isMount, selectedUserId } = this.state;
		// const th = this;
		isMount &&
			selectedUserId !== "" &&
			(await axios
				.post("/files/getFilesByUser", {
					user_id: selectedUserId
				})
				.then(res => {
					if (res.data.success) {
						let fileList = [];
						for (let row of res.data.files) {
							let fileName =
								row.fileName.substr(0, row.fileName.lastIndexOf("_")) +
								"." +
								row.fileName.substr(row.fileName.lastIndexOf(".") + 1, row.fileName.length);
							let uploadDate = row.uploadDate;
							fileList = [
								...fileList,
								{ id: row._id, fileName: fileName, link: "Click Here", uploadDate: uploadDate }
							];
						}
						this.setState({ tableData: fileList });
					} else {
						NotificationManager.error(res.data.msg, "Error!", 3000);
					}
				})
				.catch(function(error) {
					if (error.response.status === 403) {
						// console.log(th.props);
						// th.props.history.push('/signout');
					}
				}));
	}
	render() {
		const { tableData } = this.state;
		return (
			<Container fluid className='p-0'>
				<h2 className='mt-2' style={{ marginLeft: 10 }}>
					File List
				</h2>
				<ExpandableRowsTable tableData={tableData} />
			</Container>
		);
	}
}

// const mapStateToProps = state => {
// 	console.log(state.admin);
// 	return {
// 		selectedUserId: state.admin.selectedUserId,
// 		selectedUserName: state.admin.selectedUserName
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return {
// 		userSelectedState: (selectedUserId, selectedUserName) =>
// 			dispatch(userSelectedState(selectedUserId, selectedUserName))
// 	};
// };

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(FileList);

export default FileList;

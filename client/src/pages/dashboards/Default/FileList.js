import React, { Component } from "react";
import { Card, CardBody, Container } from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// import { MinusCircle, PlusCircle } from "react-feather";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { fileUploadState } from "../../../redux/actions/dashboardAction";

const tableColumns = [
	{
		dataField: "fileName",
		text: "File Name",
		sort: true,
		headerStyle: () => {
			return { width: "60%" };
		}
	},
	{
		dataField: "link",
		text: "Study link",
		sort: true,
		headerStyle: () => {
			return { width: "20%" };
		}
	},
	{
		dataField: "uploadDate",
		text: "Uploaded Date",
		sort: true,
		headerStyle: () => {
			return { width: "20%" };
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
					bordered={false}
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
			tableData: []
		};
	}

	componentDidMount() {
		const token = localStorage.token;
		axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		const decoded = jwt_decode(token);
		this.setState({ user_id: decoded.user._id }, () => this.getFileList());
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.file_uploaded) {
			this.getFileList();
		}
	}

	async getFileList() {
		// const th = this;
		await axios
			.post("/files/getFilesByUser", {
				user_id: this.state.user_id
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
			});
		await this.props.fileUploadState(false);
	}
	render() {
		const { tableData } = this.state;
		return (
			<Container fluid className='p-0'>
				<h1 className='mt-5'>File List</h1>
				<ExpandableRowsTable tableData={tableData} />
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		file_uploaded: state.dashboard.file_uploaded
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fileUploadState: flag => dispatch(fileUploadState(flag))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FileList);

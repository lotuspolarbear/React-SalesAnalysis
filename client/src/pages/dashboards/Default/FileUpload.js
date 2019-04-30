import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { NotificationManager } from "react-notifications";

import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import { connect } from "react-redux";
import { fileUploadState } from "../../../redux/actions/dashboardAction";

class FileUpload extends Component {
	constructor() {
		super();
		this.state = {
			user_id: "",
			selectedFile: null,
			loaded: 0,
			proBarVisible: false
		};
	}
	componentDidMount() {
		const token = localStorage.token;
		const decoded = jwt_decode(token);
		this.setState({
			user_id: decoded.user._id
		});
	}
	handleselectedFile = e => {
		this.setState({
			selectedFile: e.target.files[0],
			loaded: 0
		});
	};
	handleUpload = () => {
		var data = new FormData();
		if (this.state.selectedFile) {
			this.setState({ proBarVisible: true });
			data.append("file", this.state.selectedFile);
			data.append("user_id", this.state.user_id);
			axios
				.post("/files/upload", data, {
					onUploadProgress: ProgressEvent => {
						this.setState({
							loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
						});
					}
				})
				.then(res => {
					if (res.data.success) {
						this.props.fileUploadState(true);
						NotificationManager.success(res.data.msg, "Notification!", 3000);
						let th = this;
						th.setState({ selectedFile: null });
						setTimeout(function() {
							th.setState({ proBarVisible: false });
						}, 2000);
					} else {
						NotificationManager.error(res.data.msg, "Error!", 3000);
					}
				});
		} else {
			NotificationManager.error("File is not selected", "Error!", 3000);
		}
	};
	render() {
		const { file_uploaded } = this.props;
		return (
			<React.Fragment>
				<div className='file-upload' style={{ width: "100%" }}>
					<div className='mt-1'>
						<h1>File Upload</h1>
					</div>
					<div className='row'>
						<div className=''>
							<div className='mt-3'>
								{!file_uploaded && (
									<input
										className='btn btn-outline-info'
										type='file'
										name=''
										id=''
										onChange={this.handleselectedFile}
										style={{ marginLeft: 20 }}
									/>
								)}
								{file_uploaded && (
									<input
										className='btn btn-outline-info'
										type='file'
										name=''
										id=''
										onChange={this.handleselectedFile}
										style={{ marginLeft: 20 }}
										disabled
									/>
								)}
							</div>
						</div>
						<div className='' style={{ marginLeft: 20, marginRight: 20 }}>
							<div className='mt-3'>
								{!file_uploaded && (
									<button
										className='btn btn-info'
										style={{ marginTop: 3 }}
										onClick={this.handleUpload}
									>
										Upload
									</button>
								)}
								{file_uploaded && (
									<button
										className='btn btn-info'
										style={{ marginTop: 3 }}
										onClick={this.handleUpload}
										disabled
									>
										Upload
									</button>
								)}
							</div>
						</div>
						<div className='col'>
							{this.state.proBarVisible && (
								<div className='mt-4'>
									<Progress percent={this.state.loaded} status='success' />
								</div>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
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
)(FileUpload);

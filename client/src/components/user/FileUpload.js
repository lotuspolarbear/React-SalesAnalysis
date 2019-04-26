import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { NotificationManager } from "react-notifications";

import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
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
            this.setState({proBarVisible: true});
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
                        NotificationManager.success(
                            res.data.msg,
                            "Notification!",
                            3000
                        );
                        this.props.uploaded();
                        let th = this;
                        setTimeout(function(){ th.setState({proBarVisible: false}); }, 3000);                        
                    } else {
                        NotificationManager.error(res.data.msg, "Error!", 3000);
                    }
                });
        } else {
            NotificationManager.error("File is not selected", "Error!", 3000);
        }
    };
    render() {    
        return (
            <React.Fragment>
                <div className="file-upload">
                    <div className="mt-5">
                        <h1>File Upload</h1>
                    </div>
                    <div className="mt-5">
                        <input
                        className="btn btn-outline-info"
                        type="file"
                        name=""
                        id=""
                        onChange={this.handleselectedFile}
                        />
                    </div>
                    <div className="mt-5">
                        <button className="btn btn-info" onClick={this.handleUpload}>
                            Upload
                        </button>
                    </div>
                    {this.state.proBarVisible && (
						<div className="mt-5">
                            <Progress percent={this.state.loaded} status="success" />
                        </div>
					)}                    
                </div>
            </React.Fragment>
        );
    }
}
export default FileUpload;
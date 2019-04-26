import React, { Component } from "react";
import FileUpload from "./FileUpload";
import FileList from "./FileList";

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            updateList: 0
        }
    }

    uploaded = () => {
        this.setState({updateList: this.state.updateList + 1});
    }
    
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <FileUpload uploaded={this.uploaded} />
                        </div>
                        <div className="col-md-8">
                            <FileList update={this.state.updateList} />
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
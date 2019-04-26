import React, { Component } from "react";
import UserList from "./UserList";
import FileList from "./FileList";

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedUserId: "",
            selectedUserName: ""
        }
    }
    userSelected = (id, name) => {
        this.setState({selectedUserId: id});
        this.setState({selectedUserName: name});
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <UserList userSelected={this.userSelected}/>
                        </div>
                        <div className="col-md-5">
                            <FileList selectedUserId={this.state.selectedUserId} selectedUserName={this.state.selectedUserName}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
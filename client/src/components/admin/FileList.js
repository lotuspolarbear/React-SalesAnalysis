import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { NotificationManager } from "react-notifications";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    {
        id: "fileName",
		label: "Name"
    },
    {
        id: "link",
        label: "Study link"
    },
    {
        id: "uploadDate",
        label: "Uploaded Date"
    }
];

class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy } = this.props;
		return (
			<TableHead>
				<TableRow>
					{rows.map(row => {
						return (
							<TableCell key={row.id} align={"center"} sortDirection={orderBy === row.id ? order : false}>
								<Tooltip title='Sort' enterDelay={300}>
									<TableSortLabel
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 7
    },
	table: {
		minWidth: 300
	},
	tableWrapper: {
		overflowX: "auto"
	}
});

class FileList extends Component {
    constructor() {
        super();
		this.state = {
            seletedUserId: "",
            selectedUserName: "",
			fileList: [],
			order: "asc",
			orderBy: "",
			page: 0,
			rowsPerPage: 10
		};
    }
    componentDidMount() {
        const token = localStorage.token;
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        this.getFileList();        
    }

    componentWillReceiveProps(nextProps){
        this.setState({selectedUserName: nextProps.selectedUserName});
        this.setState({seletedUserId: nextProps.selectedUserId}, () => this.getFileList());
    }
    getFileList() {
        if(this.state.seletedUserId !== ""){
            axios.post("/files/getFilesByUser", {
                user_id: this.state.seletedUserId
            }).then(res => {
                if(res.data.success){
                    this.setState({ fileList: res.data.files });
                } else {
                    NotificationManager.error(res.data.msg, "Error!", 3000);
                }			
            }).catch(function (error) {
                if (error.response.status === 403) {
                    // console.log(th.props);
                    // th.props.history.push('/signout');
                }
            });
        }		
    }
    handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}
		this.setState({ order, orderBy });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};
    render() {
        var data = this.state.fileList;
		const { classes } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
        
        return (
            <React.Fragment>
                <div className="file-upload">
                    {(this.state.fileList.length === 0 ) && (
                        <div className="mt-5">
                            <h1>File List</h1>
                            <Paper className={classes.root}>
                                <div className="margin-50"><h3 className="paper-info">User is not selected.</h3></div>                                
                            </Paper>
                        </div>                            
                    )}
                    {(this.state.fileList.length !== 0 ) && (
                        <div className="mt-5">
                            <h1>File List of {this.state.selectedUserName}</h1>
                            <Paper className={classes.root}>
                                <div className={classes.tableWrapper}>
                                    <Table className={classes.table} aria-labelledby='tableTitle'>
                                        <EnhancedTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={this.handleRequestSort}
                                            rowCount={data.length}
                                        />
                                        <TableBody>
                                            {stableSort(data, getSorting(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map(file => {
                                                    return (
                                                        <TableRow hover tabIndex={-1} key={file._id}>
                                                            <TableCell align={"center"}>{file.fileName.substr(0, file.fileName.lastIndexOf("_"))+"."+file.fileName.substr(file.fileName.lastIndexOf(".")+1, file.fileName.length)}</TableCell>
                                                            <TableCell align={"center"}><a>Click here</a></TableCell>
                                                            <TableCell align={"center"}>{file.uploadDate}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </div>
                                <TablePagination
                                    component='div'
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    backIconButtonProps={{
                                        "aria-label": "Previous Page"
                                    }}
                                    nextIconButtonProps={{
                                        "aria-label": "Next Page"
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>
                    )}                       
                </div>
            </React.Fragment>
        );
    }
}
FileList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FileList);
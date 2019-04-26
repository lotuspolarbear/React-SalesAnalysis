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
        id: "name",
		label: "Name"
    },
    {
        id: "email",
        label: "Email"
    },
    {
        id: "companyName",
        label: "Company Name"
    },
    {
        id: "phoneNumber",
        label: "Phone Number"
    },
    {
        id: "Role",
        label: "Role"
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

class UserList extends Component {
    constructor() {
        super();
		this.state = {
			userList: [],
			order: "asc",
			orderBy: "",
			page: 0,
			rowsPerPage: 10
		};
    }
    async componentDidMount() {
        const token = localStorage.token;
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        this.getUserList();        
    }

    getUserList() {        
		//const th = this;
		axios.get("/users/getAllUsers").then(res => {
            if(res.data.success){
                this.setState({ userList: res.data.users });
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
    selectUser(id, name){
        this.props.userSelected(id, name);
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
        var data = this.state.userList;
		const { classes } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
        
        return (
            <React.Fragment>
                <div className="file-upload">
                    <div className="mt-5">
                        <h1>User List</h1>
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
                                            .map(user => {
                                                return (
                                                    <TableRow hover tabIndex={-1} key={user._id} onClick = {event => this.selectUser(user._id, user.firstName+" "+user.lastName)}>
                                                        <TableCell align={"center"}>{user.firstName + " " + user.lastName}</TableCell>
                                                        <TableCell align={"center"}>{user.email}</TableCell>
                                                        <TableCell align={"center"}>{user.companyName}</TableCell>
                                                        <TableCell align={"center"}>{user.phoneNumber}</TableCell>
                                                        <TableCell align={"center"}>{user.role}</TableCell>
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
                </div>
            </React.Fragment>
        );
    }
}
UserList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserList);
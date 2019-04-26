const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create User Schema

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	companyName: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true
    },
    userType: {
        type: Boolean,
        required: true
    },
	password: {
		type: String,
		required: true
	}
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.addUser = function(newUser, callback) {
	newUser.save(callback);
};

module.exports.checkUser = function(requestedUser, callback) {
	User.findOne({ email: requestedUser.email, password: requestedUser.password }, callback);
};

module.exports.getAllUsers = function(callback) {
	User.find({ userType: false })
		.sort({ _id: -1 })
		.exec(callback);
};
module.exports.changePassword = function(user, callback){
	console.log(user);
	User.findOneAndUpdate(
		{ _id: user.accountId },
		{ password: user.password },
		{ new: true },
		callback
	);
}

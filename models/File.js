const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create File Schema

const FileSchema = new Schema({
	fileName: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	uploadDate: {
		type: String,
		required: true
	}
});

const File = (module.exports = mongoose.model("File", FileSchema));

module.exports.addFile = function(newFile, callback) {
	newFile.save(callback);
};
module.exports.getFilesByUser = function(user_id, callback) {
	File.find({ user_id: user_id })
		.sort({ _id: -1 })
		.exec(callback);
};
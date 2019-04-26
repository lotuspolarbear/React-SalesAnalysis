const express = require("express");
const users = express.Router();
const fileUpload = require("express-fileupload");
const date = require("date-and-time");
const File = require("../models/File");
const authService = require("../services/authService");

users.use(fileUpload());

// Upload File
users.post("/upload", authService.verifyTokenExistance, (req, res, next) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        if (Object.keys(req.files).length == 0) {
            res.json({
                success: false,			
                msg: "Uploading failed."				
            });
        } else {
            var uploadFile = req.files.file;
            var realName = req.files.file.name;
            const fileName = realName.substr(0, realName.lastIndexOf('.')) + "_" + Date.now() + "." + realName.substr(realName.lastIndexOf('.')+1, realName.length);
            
            uploadFile.mv("./uploads/" + fileName, function(err) {
                if (err) {
                    res.json({
                        success: false,
                        msg: err
                    });
                } else {
                    let newFile = new File({
                        fileName: fileName,
                        user_id: req.body.user_id,
                        uploadDate: date.format(new Date(), "MM-DD-YYYY HH:mm")
                    });
                    File.addFile(newFile, (err, File) => {
                        if (err) {
                            return res.json({ success: false, msg: err });
                        } else {
                            return res.json({ success: true, msg: "File was uploaded successfully." });
                        }
                    });
                }
            });
        }
    }       
});

users.post("/getFilesByUser", authService.verifyTokenExistance, (req, res, next) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let user_id = req.body.user_id;
		File.getFilesByUser(user_id, (err, files) => {
			if (err) {
				return res.json({
                    success: false,
                    msg: "Something went wrong. Please refresh the page."
                });
			} else {
				return res.json({ success: true, files: files });
			}
		});
    }
})

module.exports = users;
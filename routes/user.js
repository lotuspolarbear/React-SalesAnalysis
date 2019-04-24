const express = require("express");
const Crypto = require("../services/cryptoService");
const jwt = require('jsonwebtoken');
const router = express.Router();
const tokenSecretKey = require("../config/config").tokenSecretKey;
const tokenExpireTime = require("../config/config").tokenExpireTime;
const authService = require("../services/authService");
// Importing User Model
const User = require("../models/User");

// Register New User
router.post("/register", (req, res) => {
    User.find({email : req.body.email}, function (err, users) {
        if (users.length > 0){
            return res.json({ success: false, msg: "This Email already exists." });
        }else{
            let password = Crypto.encrypt(req.body.password);
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                companyName: req.body.companyName,
                phoneNumber: req.body.phoneNumber,
                role: req.body.role,
                userType: 0,
                password: password
            });
            User.addUser(newUser, (err, User) => {
                if (err) {
                    return res.json({ success: false, msg: err });
                } else {
                    return res.json({ success: true, msg: "You singed up successfully." });
                }
            });
        }
    });
});
// Login User / Return user type and token
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log(email, password);
		if (typeof password !== "string") {
			return res.json({
				success: false,
				errors: [
					{
						title: "Bad Request",
						message: "Password must be a string"
					}
				]
			});
		}
		//queries database to find a user with the received email
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("You are not signed up.");
		}
		var decryptedPass = Crypto.decrypt(user.password);
		
		if (password!=decryptedPass) {
			throw new Error("Password is incorrect.");
		}
		jwt.sign({user: user}, tokenSecretKey, {expiresIn: tokenExpireTime}, (err, token) => {
			res.json({
				token: token,
				success: true,
				userType: user.userType,
				title: "Sign In Successful",
				message: "Welcome to Sales Analysis Dashboard."
			});
		});
		
	} catch (err) {
		res.json({
			success: false,
			errors: [
				{
					title: "Invalid Credentials",
					message: err.message
				}
			]
		});
	}
});

router.get("/getAllUsers", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        User.find()
		.sort({ subAcctId: -1 })
		.then(accounts => res.json(accounts));
    }
});

module.exports = router;

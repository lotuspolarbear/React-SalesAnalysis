const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Importing routes
const users = require("./routes/users");
const files = require("./routes/files");

const app = express();
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const uri = require("./config/config").mongoURI;
mongoose
	.connect(uri)
	.then(() => console.log("MongoDB connected..."))
	.catch(err => console.log(err));
// Use Routes

app.use("/users", users);
app.use("/files", files);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server started on port " + port));
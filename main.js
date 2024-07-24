// required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 4;

var connection = false; // global variable to check whether connection to db was established or errored.

require("dotenv").config(); // load .env variables into process

// function to connect to the database
async function connect() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("Connected to the database...");
        connection = true;
    } catch (err) {
        console.error(err);
    }
}

connect();

const app = express();
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
});

const user = mongoose.model("users", userSchema);

app.use(bodyParser.json()); // parse json-formatted request body - middle-ware
app.use(cors());
app.use("/", express.static("pub"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/loginPage.html");
});

async function createUser(username, password) {
    try {
        if (
            username &&
            password &&
            username.length >= 3 &&
            username.length < 21 &&
            password.length >= 8
        ) {
            let newUser = new user({
                username: username,
                password: await bcrypt.hash(password, saltRounds),
            });

            await newUser.save();
            console.log("User created...")
        } else {
            throw new Error("Username and password criteria not met!")
        }
    } catch (err) {
        return console.error(err);
    }
}

app.post("/api/login", async (req, res) => {
    if (!connection) {
        res.json({
            status: 0,
            reason: "connection to the database couldn't be established",
        });
    } else {
        // established connection to database
        // search for user
        try {
            let body = req.body;
            let userDoc = await user.findOne({ username: body.user }); // username is unique by database schema, so this shouldn't limit search.
            let status = 0;
            let reason = "User not found.";

            if (userDoc) {
                const res = await bcrypt.compare(body.pass, userDoc.password);
                if (res) {
                    status = 1;
                    reason = "Username and Password record matched!";
                } else {
                    status = 0;
                    reason = "Username and Password record does not match!";
                }
            }

            res.json({
                status: status,
                reason: reason,
            });
        } catch (err) {
            res.json({
                status: 0,
                reason: "Server.",
            });
        }
    }
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Listening on PORT " + listener.address().port);
});

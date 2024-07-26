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
}); // user schema
const user = mongoose.model("users", userSchema); // user model

app.use(bodyParser.json()); // parse json-formatted request body - middle-ware
app.use(cors());
app.use("/", express.static("pub"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/loginPage.html");
});


app.post("/api/signup", async (req, res) => {
  if (!connection) {
    res.json({
      status: 0,
      reason: "connection to the database couldn't be established",
    });
  } else {
    // connection to the database is successful
    let body = req.body;
    let username = body.user;
    let password = body.pass;
    let status = 0;
    let reason = "User exists";

    // now, we need to make sure the user doesn't exist.
    try {
      let userDoc = await user.findOne({ username: body.user }); // promise resolves to null if user is not found

      if (!userDoc) {
        // user does not exist
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
          status = 1;
          reason = "Username and Password combination successfully recorded!";
          console.log("User created...");
        } else {
            status = 0;
            reason = "Username and Password validation failed!"
        }
      }
    } catch (err) {
        status = 0;
        reason = "Serve Error."
    }

    res.json({
        status: status,
        reason: reason
    })
  }
});

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
        reason: "Server Error.",
      });
    }
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Listening on PORT " + listener.address().port);
});

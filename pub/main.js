function togglePassword() {
    // Enables users to see their password by changing the input type from 'password' to 'text'
    // Toggled by the checkbox

    var passInput = document.getElementById("password");
    var toggler = document.getElementById("toggle");

    // Check if the toggler checkbox is checked
    if (toggler.checked) {
        // Show the password by setting input type to 'text'
        passInput.type = "text";
    } else {
        // Hide the password by setting input type to 'password'
        passInput.type = "password";
    }
}

function createUser() {
    /* Enables user to add a particular username and password combination to the server's database
       If the user uses that username:password combination again, they can successfully log in
       Might error if the username already exists or if the username and password criteria aren't met */

    var userInput = document.getElementById("username");
    var passInput = document.getElementById("password");

    // Get username and password values from input fields
    var username = userInput.value;
    var password = passInput.value;
    var errNoti = document.getElementById("error");

    // Validate username and password
    var [valid, err] = isValid(username, password);

    // Clear any previous error messages
    errNoti.innerHTML = "";

    // If validation fails, display the errors
    if (!valid) {
        for (let i = 0; i < err.length; i++) {
            errNoti.innerHTML += err[i];
            if (i != (err.length - 1)) {
                errNoti.innerHTML += "<br>";
            }
        }
    } else { 
        // If validation is successful, send the user data to the server

        let body = {
            user: username,
            pass: password
        };

        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((res) => {
            if (!res.ok) {
                throw new Error("Network error (not okay).");
            }
            return res.json();
        }).then((data) => {
            console.log(data);
            if (data.status == 0) {
                // Something went wrong
                throw new Error(data.reason);
            }
            window.alert("Successfully created the username and password record in the database!");
        }).catch((error) => {
            // Display error message
            errNoti.innerHTML = error;
        });
    }
}

function login() {
    // Enables users to log in through a POST request to the API
    // Validates password and username client-side

    var userInput = document.getElementById("username");
    var passInput = document.getElementById("password");

    // Get username and password values from input fields
    var username = userInput.value;
    var password = passInput.value;
    var errNoti = document.getElementById("error");

    // Validate username and password
    var [valid, err] = isValid(username, password);

    // Clear any previous error messages
    errNoti.innerHTML = "";

    // If validation fails, display the errors
    if (!valid) {
        for (let i = 0; i < err.length; i++) {
            errNoti.innerHTML += err[i];
            if (i != (err.length - 1)) {
                errNoti.innerHTML += "<br>";
            }
        }
    } else {
        // If validation is successful, send the login data to the server

        let body = {
            user: username,
            pass: password
        };

        fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Network error (not okay).");
            }
            // Convert response body to JSON
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.status == 0) {
                throw new Error(data.reason);
            } else {
                window.alert("Successfully logged in!");
            }
        }).catch(error => {
            // Display error message
            errNoti.innerHTML = error;
        });
    }
}

function isValid(username, password) {
    // Ensures username and password input meet criteria
    // If not, login is not processed, and errors are showcased in the errs array

    var errs = [];
    var valid = true;

    // Validate username length: 3 - 20 characters
    if (username.length < 3 || username.length > 20) {
        valid = false;
        errs.push("Username must be between 3 - 20 characters long.");
    }

    // Validate password length: at least 8 characters
    if (password.length < 8) {
        valid = false;
        errs.push("Password must be at least 8 characters.");
    }

    return [valid, errs];
}
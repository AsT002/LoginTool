function togglePassword() {
    // enables users to see their password by changing password field/input into text type instead of password type.
    // toggled by the checkbox.

    var passInput = document.getElementById("password")
    var toggler = document.getElementById("toggle")

    if (toggler.checked) {
        passInput.type = "text"
    } else {
        passInput.type = "password"
    }
}

function login() {
    // enables users to login through a POST request to api
    // validates password and username client-side

    var userInput = document.getElementById("username")
    var passInput = document.getElementById("password")

    // validate password & password
    var username = userInput.value;
    var password = passInput.value;
    var errNoti = document.getElementById("error")
    var [valid, err] = isValid(username, password);

    errNoti.innerHTML = ""

    if (!valid) {
        for (let i = 0; i < err.length; i ++) {
            errNoti.innerHTML += err[i]
            if (i != (err.length - 1)) {
                errNoti.innerHTML += "<br>"
            }
        }
    } else {
        // valid password
        let body = {
            user: username,
            pass: password
        }

        fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Network error (not okay).")
            }
            // converty response body to JSON (promise that resolves into JSON data)
            return response.json()
        }).then(data => {
            if (data.status == 0) {
                throw new Error(data.reason)
            } else {
                window.alert("Successfully logged in!")
            }
        }).catch(error => {
            window.alert(error);
        })
    }

}

function isValid(username, password) {
    // makes sure username and password input are within criteria.
    // if not, login isn't proceeded, and showcases the error that the user needs to fix in the errs array.

    var errs = [];
    var valid = true;

    // validate username

    // username length: 3 - 20
    if (username.length < 3 || username.length > 20) {
        valid = false;
        errs.push("Username must be between 3 - 20 characters long.")
    }

    // password length >= 8
    if (password.length < 8) {
        valid = false;
        errs.push("Password must be atleast 8 characters.")
    }

    return [valid, errs]
}
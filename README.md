Add an .env file with PORT and MONGOOSE_URI variables in order to run the server with the .sh file.
127.0.0.1:PORT/

Server Side:
Serves client-side files (pub) at 127.0.0.1:PORT/ (html, css, js, images)
The login api route is /api/login, which takes POST requests.
  RETURNS json, {status: 0 or 1, reason: STRING}
   0 -> fail
    1 -> success.

Both client and server side has password validation, making sure they match the criteria (user char >= 3 and <= 20, pass >= 8).

<img src="https://github.com/AsT002/LoginTool/blob/main/pub/Screenshot%202024-07-26%20at%2011.44.54%20AM.png" alt="Client-side view of the Authentication/Login tool.">

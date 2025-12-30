"use strict";

var express = require("express");
var app = express();

var http = require("http").Server(app);
var socketio = require("socket.io")(http);

var port = process.env.PORT || 3000; // ✅ Corrected

var users = [];

socketio.on("connection", function(socket) {
    console.log("A user connected.");

    socket.on("join", function(userName) {
        console.log("User changed name to: " + userName);

        socket.userName = userName;
        users.push(userName);

        socketio.sockets.emit("refreshUserList", users);
    });

    socket.on("message", function(message) {
        console.log(socket.userName + " says: " + message);

        var data = {
            userName: socket.userName,
            message: message
        };

        socketio.emit("message", data);
    });

    socket.on("disconnect", function() {
        var removedUserIndex = users.indexOf(socket.userName);
        if (removedUserIndex >= 0) {
            users.splice(removedUserIndex, 1);
        }

        socketio.sockets.emit("refreshUserList", users);

        console.log("User " + socket.userName + " disconnected");
    });
});

http.listen(port, function() {
    console.log("Server running on PORT: " + port);
});

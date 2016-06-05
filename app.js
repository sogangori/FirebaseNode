var firebase = require("firebase");
var express = require("express");

// Create HTTP Server
var app = express();
var server = require("http").createServer(app);
// Attach Socket.io server 
var io = require("socket.io")(server);
// Indicate port 3000 as host
var port = process.env.PORT || 3000;


var config = {
    serviceAccount: "My First App-5acde8a19172.json",
    databaseURL: "https://amber-fire-9368.firebaseio.com"
};

firebase.initializeApp(config);
var db = firebase.database();
var dbRef = db.ref();

dbRef.once("value", function (snapshot) {
    console.log(snapshot.val());
});

// Make the server listens on port 3000
server.listen(port, function () {
    console.log("Server listening on port %d", port);
});

// Routing to static files
app.use(express.static(__dirname + "/public"));

// Socket server listens on connection event
io.on("connection", function (socket) {
    console.log("Connected and ready!");

    // firebase reference listens on value change, 
    // and return the data snapshot as an object
    dbRef.on("value", function (snapshot) {
        var colorChange = snapshot.val();

        // Print the data object's values
        console.log("snapshot R: " + colorChange.r);
        console.log("snapshot B: " + colorChange.b);
        console.log("snapshot G: " + colorChange.g);
    });
});
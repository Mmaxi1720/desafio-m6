"use strict";
exports.__esModule = true;
var database_1 = require("./database");
var cors = require("cors");
var express = require("express");
var port = process.env.PORT || 3002;
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
var userCollection = database_1.baseDeDatos.collection("users");
var roomCollection = database_1.baseDeDatos.collection("rooms");
var rtdbRoomRef = database_1.realtimeDatabase.ref("rooms");
app.get('/rooms/:roomid/:username', function (req, res) {
    var roomid = req.params.roomid;
    var userName = req.params.username;
    var roomidToNumber = Number(roomid);
    roomCollection.where("id", "==", roomidToNumber).get().then(function (e) {
        if (e.empty) {
            res.status(404).json({
                message: "room not found"
            });
        }
        else {
            res.send(e.docs[0].data());
            var roomRef = database_1.realtimeDatabase.ref("rooms/" + roomid);
            roomRef.update({
                invited: userName,
                invitedonline: true
            });
        }
    });
});
app.post("/rooms/:roomid/:username/:play", function (req, res) {
    var roomid = req.params.roomid;
    var userName = req.params.username;
    var userPlay = req.params.play;
    var roomRef = database_1.realtimeDatabase.ref("rooms/" + roomid);
    roomRef.get().then(function (snap) {
        var data = snap.val();
        if (userName == data.owner) {
            roomRef.update({
                ownerplay: userPlay
            }).then(function () {
                roomRef.get().then(function (snap) {
                    var dataNueva = snap.val();
                    res.send(dataNueva);
                });
            });
        }
        else if (userName == data.invited) {
            roomRef.update({
                invitedplay: userPlay
            }).then(function () {
                roomRef.get().then(function (snap) {
                    var dataNueva = snap.val();
                    res.send(dataNueva);
                });
            });
        }
    });
});
app.post("/users", function (req, res) {
    var newUserDoc = userCollection.doc();
    newUserDoc.create(req.body).then(function () {
        res.send(newUserDoc.id);
    });
});
app.post("/rooms", function (req, res) {
    var newRoomDoc = roomCollection.doc();
    newRoomDoc.create(req.body).then(function () {
        res.send(newRoomDoc.id);
    });
});
/*  const roomRef = rtdb.ref("rooms/"+ nanoid())
 roomRef.set({
     messages: [],
     owner: userId, */
app.post("/rooms/:roomid/:users", function (req, res) {
    var _a;
    var roomid = req.params.roomid;
    var user = req.params.users;
    rtdbRoomRef.update((_a = {},
        _a[roomid] = {
            owner: user,
            owneronline: true,
            invitedonline: false
        },
        _a)).then(function () {
        res.send("Room Created");
    });
});
app.post("/invitedoff/:roomid", function (req, res) {
    var roomid = req.params.roomid;
    var roomRef = database_1.realtimeDatabase.ref("rooms/" + roomid);
    roomRef.update({
        invitedonline: false
    }).then(function () {
        res.send("Invited Off");
    });
});
app.post("/readyoff/:roomid", function (req, res) {
    var roomid = req.params.roomid;
    var roomRef = database_1.realtimeDatabase.ref("rooms/" + roomid);
    roomRef.update({
        invitedready: false,
        ownerready: false
    }).then(function () {
        res.send("Invited Off");
    });
});
app.post("/playerready/:roomid/:user", function (req, res) {
    var _a;
    var roomid = req.params.roomid;
    var user = req.params.user;
    var roomRef = database_1.realtimeDatabase.ref("rooms/" + roomid);
    roomRef.update((_a = {},
        _a[user] = true,
        _a)).then(function () {
        res.send("Player Ready");
    });
});
app["delete"]("/rooms/:roomid", function (req, res) {
    var roomid = req.params.roomid;
    var roomRefInvited = database_1.realtimeDatabase.ref("rooms/" + roomid + "/invitedplay");
    var roomRefOwner = database_1.realtimeDatabase.ref("rooms/" + roomid + "/ownerplay");
    roomRefOwner.remove();
    roomRefInvited.remove();
    res.send("Jugadas Eliminadas");
});
app.get("*", function (req, res) {
    res.send(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Iniciando en http://localhost:".concat(port));
});

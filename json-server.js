"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// json-server.ts
var jsonServer = require("json-server");
var db = require("./db.json");
var server = jsonServer.create();
var middlewares = jsonServer.defaults();
var port = 3001; // Choose a port for your server
server.use(middlewares);
server.use(jsonServer.router(db));
server.listen(port, function () {
    console.log("JSON Server is running on port ".concat(port));
});

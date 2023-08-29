"use strict";

var app = require("./server.js");

require("greenlock-express")
    .init({
        packageRoot: __dirname,
        configDir: "./greenlock.d",
        maintainerEmail: "renaldomusto@gmail.com",
        cluster: false
    })
    .serve(app);

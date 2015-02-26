'use strict';
// ensure the NODE_ENV is set to 'test'
process.env.NODE_ENV = 'test';
var app = require('../app').app;

module.exports.app = app;

before(function (done) {
    function checkState() {
        if(app.started && app.started === true) {
            return done()
        }
        return setTimeout(checkState, 100)
    }

    checkState();
});
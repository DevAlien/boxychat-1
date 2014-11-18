var _ = require('lodash'),
    express = require('express'),
    requireAll = require('require-all'),
    config = require('./config/config'),
    path = require('path'),
    waterline = require('waterline'),
    baseModel = require('./lib/model'),
    baseController = require('./lib/controller');

// Instantiate a new instance of the ORM
var orm = new waterline();

var rootPath = path.normalize(__dirname + '/api');

var app = express();
var server = require('http').Server(app);

// Require all models, controllers
var models = requireAll(rootPath + '/models'),
    controllers = requireAll(rootPath + '/controllers'),
    routes = requireAll(rootPath + '/routes');

// Load models into waterline
_(models).each(function (model) {
    orm.loadCollection(waterline.Collection.extend(new baseModel(model)));
});

orm.initialize(config.orm, function (err, models) {
    if (err) throw err;

    app.models = models.collections;
    app.databases = models.connections;

    app.config = config.app;

    require('./config/express')(app, app.config, function () {

        // Load routes
        app.routes = {};
        _(routes).each(function (route, key) {
            app.routes[key] = route(app);
        });

        // Load listen socket
        app.sockets = require('./config/socket-io')(server, app);

        // Load controllers
        app.controllers = {};
        _(controllers).each(function (controller, key) {
            var model = controller.model ? app.models[controller.model] : null;
            controller.mount.call(new baseController(model, controller.routes), app);
            app.controllers[key] = controller;
        });
        });
    });

    app.listen(config.app.port, function () {
        console.log(config.app.name + ' server listening on port ' + config.app.port);
    });

});
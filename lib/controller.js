// A controller that all others can inherit from, like using sails' blueprints

var BaseController = function (model, routesFn) {
    var router = require('express').Router();

    // First apply the actions from the controller that will inherit from this one.
    routesFn(router);

    if (!model) {
        return router;
    }

    // Then define this controller's CRUD actions:

    // Search
    router.get('/', function (req, res, next) {
        model.find().exec(function (err, modelsFound) {
            if (err) return res.json(500, {err: err});
            res.json(modelsFound);
        });
    });
    // Create
    router.post('/', function (req, res, next) {
        model.create(req.body, function (err, modelCreated) {
            if (err) return res.json(500, {err: err});
            res.json(modelCreated);
        });
    });
    // Read
    router.get('/:id', function (req, res, next) {
        model.findOne({id: req.params.id}, function (err, modelFound) {
            if (err) return res.json(500, {err: err});
            res.json(modelFound);
        });
    });
    // Update
    router.put('/:id', function (req, res, next) {
        // Don't pass ID to update
        delete req.body.id;

        model.update({id: req.params.id}, req.body, function (err, modelUpdated) {
            if (err) return res.json(500, {err: err});
            res.json(modelUpdated);
        });
    });
    // Delete
    router.delete('/:id', function (req, res, next) {
        model.destroy({id: req.params.id}, function (err) {
            if (err) return res.json(500, {err: err});
            res.json({status: 'ok'});
        });
    });

    // Provide back the auto-generated route path
    router.path = '/' + model.identity;

    return router;
};

module.exports = BaseController;



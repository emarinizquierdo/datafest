'use strict';

var _ = require('lodash');
var Aire = require('./aire.model');
var http = require('http');
var CSVConverter = require("csvtojson").core.Converter;

// Get list of aires
exports.index = function(req, res) {

    Aire.find(function(err, things) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, things || {});
    });

};

// Get a single aire
exports.show = function(req, res) {

    var _query = {};

    _query.timestamp = (req.params.id) ? req.params.id : null;

    if (req.query.station) {
        _query.station = "28079099";
    }

    if (req && req.query && req.query.parameter && Array.isArray(req.query.parameter) && (req.query.parameter.length > 1)) {
        _query.parameter = {
            $in: req.query.parameter
        }
    } else if (req && req.query && req.query.parameter) {
        _query.parameter = req.query.parameter;
    }

    Aire.find(_query, function(err, aire) {

        if (err) {
            return handleError(res, err);
        }
        if (!aire) {
            _checkHourDay(function() {
                return res.send(404);
            });
        }
        return res.json(aire);
    });
};

// Creates a new aire in the DB.
exports.create = function(req, res) {
    Aire.create(req.body, function(err, aire) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, aire);
    });
};

// Updates an existing aire in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Aire.findById(req.params.id, function(err, aire) {
        if (err) {
            return handleError(res, err);
        }
        if (!aire) {
            return res.send(404);
        }
        var updated = _.merge(aire, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, aire);
        });
    });
};

// Deletes a aire from the DB.
exports.destroy = function(req, res) {
    Aire.findById(req.params.id, function(err, aire) {
        if (err) {
            return handleError(res, err);
        }
        if (!aire) {
            return res.send(404);
        }
        aire.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}


function _checkHourDay(p_callback) {

}

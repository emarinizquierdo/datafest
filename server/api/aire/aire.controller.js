'use strict';

var _ = require('lodash');
var Aire = require('./aire.model');
var http = require('http');

// Get list of aires
exports.index = function(p_req, p_res) {

  var options = {
    host: 'www.mambiente.munimadrid.es',
    path: '/opendata/horario.txt'
}

    var request = http.request(options, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            return p_res.send(200, data);

        });
    });
    request.on('error', function(e) {
        console.log(e.message);
    });
    request.end();

};

// Get a single aire
exports.show = function(req, res) {
    Aire.findById(req.params.id, function(err, aire) {
        if (err) {
            return handleError(res, err);
        }
        if (!aire) {
            return res.send(404);
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

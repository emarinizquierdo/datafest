'use strict';

var _ = require('lodash');
var Aire = require('./aire.model');
var http = require('http');
var CSVConverter=require("csvtojson").core.Converter;

// Get list of aires
exports.index = function(p_req, p_res) {

    var options = {
        host: 'www.mambiente.munimadrid.es',
        path: '/opendata/horario.txt'
    }

    var request = http.request(options, function(res) {
        var data = 'CE01,CE02,CE03,PARAMETER,tecnic,period,year,month,day,hour,v,hour1,v,hour2,v,hour3,v,hour4,v';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {

            var csvConverter = new CSVConverter();

            //end_parsed will be emitted once parsing finished
            csvConverter.on("end_parsed", function(jsonObj) {
                //final result poped here as normal.
            });
            csvConverter.fromString(data, function(err, jsonObj) {
                if (err) {
                    //err handle
                }
                return p_res.send(200, jsonObj);
                console.log(jsonObj);
            });

            

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

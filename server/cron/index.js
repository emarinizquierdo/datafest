'use strict';

var express = require('express');
var _ = require('lodash');
var Aire = require('../api/aire/aire.model');
var http = require('http');
var cron = require('cron');
var CSVConverter = require("csvtojson").core.Converter;

var _cron = {};

_cron.start = function() {
    var cronJob = cron.job("0 0 * * * *", consumer, null, true);
    cronJob.start();
}

var consumer = function() {

    console.log('consuming...');

    var options = {
        host: 'www.mambiente.munimadrid.es',
        path: '/opendata/horario.txt'
    }

    var request = http.request(options, function(res) {

        var data = 'ce01,ce02,ce03,parameter,tecnic,period,year,month,day,hour0,v,hour1,v,hour2,v,hour3,v,hour4,v,' +
            'hour5,v,hour6,v,hour7,v,hour8,v,hour9,v,hour10,v,hour11,v,hour12,v,hour13,v,hour14,v,hour15,v,hour16,v,' +
            'hour17,v,hour18,v,hour19,v,hour20,v,hour21,v,hour22,v,hour23,v';

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

                console.log('toparse');
                sendToDB(parseResponse(jsonObj));

            });

        });
    });
    request.on('error', function(e) {
        console.log(e.message);
    });
    request.end();
};

var parseResponse = function(p_input) {

    var _response = [];
    var _pollutionObject = {};

    for (var i = 0; i < p_input.length; i++) {

        _pollutionObject = {};

        for (var j = 0; j < 24; j++) {
            _pollutionObject = {
                parameter: p_input[i].parameter,
                tecnic: p_input[i].tecnic,
                period: p_input[i].period,
                ce01: p_input[i].ce01,
                ce02: p_input[i].ce02,
                ce03: p_input[i].ce03,
                id: '' + p_input[i].ce01 + p_input[i].ce02 + p_input[i].ce03 + p_input[i].parameter + p_input[i].year + p_input[i].month + p_input[i].day + j,
                timestamp: new Date(p_input[i].year, p_input[i].month - 1, p_input[i].day - 1, j, 0, 0).getTime(),
                value: p_input[i]['hour' + j]
            };
            _response.push(_pollutionObject);
        }

    }

    return _response;
};

var sendToDB = function(p_array) {

    console.log('to save');

    var i = 0,
        length = p_array.length;

    _upsert();

    function _upsert() {
        Aire.update({
            id: p_array[i].id
        }, p_array[i], {
            upsert: true
        }, function(err, jellybean, snickers) {
            if (err) {
                console.log(err);
            } else {
                i++;
                if (i < length) {
                    _upsert(p_array[i]);
                } else {
                    console.log('dump finished');
                }
            }
        });
    }

}

module.exports = _cron;

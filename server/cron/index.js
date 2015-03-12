'use strict';

var express = require('express');
var _ = require('lodash');
var Aire = require('../api/aire/aire.model');
var http = require('http');
var cron = require('cron');
var CSVConverter = require("csvtojson").core.Converter;

var _cron = {};

_cron.start = function() {
    var cronJob = cron.job("0 */1 * * * *", consumer, null, true);
    cronJob.start();
}

var consumer = function() {
	console.log('consuming...');

    var options = {
        host: 'www.mambiente.munimadrid.es',
        path: '/opendata/horario.txt'
    }

    var request = http.request(options, function(res) {
        var data = 'CE01,CE02,CE03,PARAMETER,tecnic,period,year,month,day,hour,v,hour1,v,hour2,v,hour3,v,hour4,v,' +
            'hour5,v,hour6,v,hour7,v,hour8,v,hour9,v,hour10,v,hour11,v,hour12,v,hour13,v,hour14,v,hour15,v,hour16,v,' +
            'hour17,v,hour18,v,hour19,v,hour20,v,hour21,v,hour22,v,hour23,v,hour24,v';
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
                console.log(jsonObj);
            });



        });
    });
    request.on('error', function(e) {
        console.log(e.message);
    });
    request.end();
};

module.exports = _cron;

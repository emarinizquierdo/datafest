'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StationSchema = new Schema({
    "FID": String,
    "StationCod": Number,
    "Name": String,
    "Latitud": String,
    "Longitud": String,
    "Latitud_D": Number,
    "Longitud_D": Number,
    "MostPollut": Number,
    "LessPollut": Number,
    "Intermedia": Number
});

module.exports = mongoose.model('Station', StationSchema);

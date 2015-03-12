'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AireSchema = new Schema({
    id: String,
    timestamp: Number,
    parameter: Number,
    tecnic: Number,
    period: Number,
    value: Number,
    ce01: Number,
    ce02: Number,
    ce03: Number
});

module.exports = mongoose.model('Aire', AireSchema);

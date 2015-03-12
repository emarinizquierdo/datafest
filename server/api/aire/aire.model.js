'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AireSchema = new Schema({
  timestamp: Number,
  ce01: Number,
  ce02: Number,
  ce03: Number,
  parameter: Number,
  tecnic: Number,
  period: Number,
  year: Number,
  day: Number,
  hour: Number,
  value: Number
});

module.exports = mongoose.model('Aire', AireSchema);